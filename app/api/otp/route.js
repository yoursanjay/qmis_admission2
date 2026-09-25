import { NextResponse } from 'next/server';

function normalizeWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  throw new Error('Invalid phone number.');
}

function generateOtp() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
}

export async function POST(request) {
  try {
    const { phone } = await request.json();
    const token = process.env.ASKEVA_TOKEN || process.env.NEXT_PUBLIC_ASKEVA_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'OTP service is not configured.' }, { status: 500 });
    }

    const otp = generateOtp();
    const url = new URL('https://backend.askeva.io/v1/message/send-message');
    url.searchParams.set('token', token);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: normalizeWhatsAppNumber(phone),
        type: 'template',
        template: {
          language: { policy: 'deterministic', code: 'en' },
          name: 'login_otp',
          components: [
            { type: 'body', parameters: [{ type: 'text', text: otp }] },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [{ type: 'text', text: otp }],
            },
          ],
        },
      }),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      return NextResponse.json({ error: 'OTP service returned an invalid response.' }, { status: 502 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: 'OTP service could not send the code.', details: responseData }, { status: 502 });
    }
    return NextResponse.json({ otp });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP.' }, { status: 400 });
  }
}