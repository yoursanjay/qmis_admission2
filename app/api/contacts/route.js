import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/serverSupabase';
import { isRecord, isValidEmail, normalizeIndianPhone, readString } from '@/lib/apiValidation';

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest('Expected a valid JSON request body.');
  }
  if (!isRecord(body)) return badRequest('Expected a JSON object.');

  const name = readString(body.name);
  const email = readString(body.email);
  const phoneInput = readString(body.phone);
  const subject = readString(body.subject);
  const message = readString(body.message);

  if (!name) return badRequest('Name is required.');
  if (!email || !isValidEmail(email)) return badRequest('A valid email is required.');
  const phone = normalizeIndianPhone(phoneInput);
  if (!phone) return badRequest('A valid 10-digit phone number is required.');
  if (!message) return badRequest('Message is required.');

  let supabase;
  try {
    supabase = getServerSupabaseClient();
  } catch {
    console.error('[api/contacts] Supabase server configuration is missing.');
    return NextResponse.json(
      { success: false, error: 'Unable to submit your message. Please try again.' },
      { status: 500 },
    );
  }

  try {
    const { error } = await supabase.from('contacts').insert({
      name,
      email,
      phone,
      subject,
      message,
    });
    if (error) {
      console.error('[api/contacts] Database insert failed.', { code: error.code });
      return NextResponse.json(
        { success: false, error: 'Unable to submit your message. Please try again.' },
        { status: 500 },
      );
    }
  } catch {
    console.error('[api/contacts] Unexpected submission failure.');
    return NextResponse.json(
      { success: false, error: 'Unable to submit your message. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: 'Contact message submitted successfully.' },
    { status: 201 },
  );
}
