import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}

export async function sendContactEmail(params: ContactEmailParams): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Visit Phong Nha Contact Form <onboarding@resend.dev>',
      to: ['glenbowdencom@gmail.com'],
      subject: `[${params.type.toUpperCase()}] ${params.subject}`,
      html: `
        <h2>🌟 New Contact Form Submission - Visit Phong Nha</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #00BCD4; margin-top: 0;">Contact Details:</h3>
          <p><strong>Name:</strong> ${params.name}</p>
          <p><strong>Email:</strong> ${params.email}</p>
          <p><strong>Inquiry Type:</strong> ${params.type}</p>
          <p><strong>Subject:</strong> ${params.subject}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #00BCD4; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${params.message}</p>
        </div>
        
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666;">
          <p><strong>📧 To respond:</strong> Reply directly to this email to contact ${params.name}</p>
          <p><strong>📅 Received:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })} (Vietnam time)</p>
          <p><em>This message was sent via the Visit Phong Nha contact form at visitphongnha.com</em></p>
        </div>
      `,
      replyTo: params.email,
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }

    console.log('Contact email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}