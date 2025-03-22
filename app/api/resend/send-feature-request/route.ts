import { Resend } from 'resend';
import FeatureRequestEmail from '../../../../emails/featureRequestEmail';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {

    const { userEmail, featureRequestText } = await request.json();

    const requestDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { data, error } = await resend.emails.send({
      from: 'Veevo <request@veevo.app>',
      to: ['giannis@kotsas.com'],
      replyTo: userEmail,
      subject: 'New Feature Request from Veevo',
      react: FeatureRequestEmail({ userEmail, requestDate, featureRequestText }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}