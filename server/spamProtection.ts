import { db } from './db';
import { rateLimits } from '@shared/schema';
import { eq, and, gte } from 'drizzle-orm';

interface SpamCheckResult {
  isSpam: boolean;
  spamScore: number;
  reasons: string[];
}

interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: Date;
}

// Spam detection patterns
const SPAM_PATTERNS = [
  // URLs and links
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  
  // Promotional text
  /\b(buy now|click here|limited time|special offer|discount|promo|deal)\b/gi,
  /\b(make money|work from home|earn \$|get rich|passive income)\b/gi,
  /\b(free|guaranteed|instant|amazing|incredible|unbelievable)\b/gi,
  
  // Repetitive patterns
  /(.)\1{4,}/g, // Same character repeated 5+ times
  /\b(\w+)\s+\1\b/gi, // Repeated words
  
  // Contact info
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email addresses
];

// Rate limiting configuration
const RATE_LIMITS = {
  guestbook_entry: { requests: 3, windowMinutes: 60 }, // 3 entries per hour
  guestbook_comment: { requests: 10, windowMinutes: 60 }, // 10 comments per hour
};

export async function checkSpam(content: string, authorName: string): Promise<SpamCheckResult> {
  let spamScore = 0;
  const reasons: string[] = [];

  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      spamScore += matches.length * 10;
      if (pattern.source.includes('http')) {
        reasons.push('Contains suspicious links');
      } else if (pattern.source.includes('buy|click|discount')) {
        reasons.push('Contains promotional language');
      } else if (pattern.source.includes('free|guaranteed')) {
        reasons.push('Contains spam keywords');
      } else if (pattern.source.includes('\\1')) {
        reasons.push('Contains repetitive patterns');
      } else if (pattern.source.includes('@')) {
        reasons.push('Contains contact information');
      }
    }
  }

  // Check message length (very short or very long can be spam)
  if (content.length < 10) {
    spamScore += 20;
    reasons.push('Message too short');
  } else if (content.length > 2000) {
    spamScore += 30;
    reasons.push('Message too long');
  }

  // Check for excessive capitalization
  const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (upperCaseRatio > 0.5 && content.length > 20) {
    spamScore += 25;
    reasons.push('Excessive capitalization');
  }

  // Check for suspicious author names
  if (authorName.match(/\d{3,}/)) {
    spamScore += 15;
    reasons.push('Suspicious author name');
  }

  // Check for non-alphabetic characters in name
  const nonAlphaRatio = (authorName.match(/[^a-zA-Z\s]/g) || []).length / authorName.length;
  if (nonAlphaRatio > 0.3) {
    spamScore += 10;
    reasons.push('Author name contains suspicious characters');
  }

  return {
    isSpam: spamScore >= 50,
    spamScore: Math.min(spamScore, 100),
    reasons
  };
}

export async function checkRateLimit(
  identifier: string,
  action: 'guestbook_entry' | 'guestbook_comment'
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[action];
  const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

  try {
    // Get existing rate limit record
    const [existingRecord] = await db
      .select()
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier),
          eq(rateLimits.action, action),
          gte(rateLimits.windowStart, windowStart)
        )
      )
      .limit(1);

    if (existingRecord) {
      const count = existingRecord.count || 0;
      const windowStart = existingRecord.windowStart || new Date();
      
      if (count >= config.requests) {
        // Rate limit exceeded
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: new Date(windowStart.getTime() + config.windowMinutes * 60 * 1000)
        };
      } else {
        // Update existing record
        await db
          .update(rateLimits)
          .set({ count: count + 1 })
          .where(eq(rateLimits.id, existingRecord.id));

        return {
          allowed: true,
          remainingRequests: config.requests - count - 1,
          resetTime: new Date(windowStart.getTime() + config.windowMinutes * 60 * 1000)
        };
      }
    } else {
      // Create new rate limit record
      await db
        .insert(rateLimits)
        .values({
          identifier,
          action,
          count: 1,
          windowStart: new Date()
        });

      return {
        allowed: true,
        remainingRequests: config.requests - 1,
        resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
      };
    }
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // In case of error, allow the request but log it
    return {
      allowed: true,
      remainingRequests: config.requests - 1,
      resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
    };
  }
}

export function getClientIP(req: any): string {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         '127.0.0.1';
}