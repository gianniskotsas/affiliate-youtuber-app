import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Add email to Resend audience
    await resend.contacts.create({
      email,
      audienceId: 'e1cec8d1-a1a1-4d7b-b48a-96493afcba49',
      unsubscribed: false,
    });

    // Send confirmation email
    await resend.emails.send({
      from: 'no-reply@veevo.app',
      to: email,
      subject: 'Welcome to Veevo!',
      html: '<p>Thank you for joining our waitlist!</p>',
    });

    return NextResponse.json({ message: 'Email added to audience and confirmation email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

