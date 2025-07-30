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
      from: 'Visit Phong Nha <onboarding@resend.dev>',
      to: ['glenbowdencom@gmail.com'],
      subject: `[${params.type.toUpperCase()}] ${params.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${params.name} (${params.email})</p>
        <p><strong>Type:</strong> ${params.type}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
        <hr>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${params.message}</p>
        <hr>
        <p><em>This message was sent via the Visit Phong Nha contact form.</em></p>
        <p><em>Reply directly to this email to respond to ${params.name}.</em></p>
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