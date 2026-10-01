import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/serverSupabase';
import { isRecord, isValidEmail, normalizeIndianPhone, readString } from '@/lib/apiValidation';

const ALLOWED_ACTIVITY_TYPES = new Set(['badminton', 'kidz-gym', 'school-activities']);

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
  const activityType = readString(body.activityType);
  const message = readString(body.message);

  if (!name) return badRequest('Name is required.');
  if (!email || !isValidEmail(email)) return badRequest('A valid email is required.');
  const phone = normalizeIndianPhone(phoneInput);
  if (!phone) return badRequest('A valid 10-digit phone number is required.');
  if (!activityType || !ALLOWED_ACTIVITY_TYPES.has(activityType)) {
    return badRequest('A valid activity type is required.');
  }

  let supabase;
  try {
    supabase = getServerSupabaseClient();
  } catch {
    console.error('[api/after-school-activity] Supabase server configuration is missing.');
    return NextResponse.json(
      { success: false, error: 'Unable to submit your enquiry. Please try again.' },
      { status: 500 },
    );
  }

  try {
    const { error } = await supabase.from('after_school_activities').insert({
      name,
      email,
      phone,
      activity_type: activityType,
      message,
    });
    if (error) {
      console.error('[api/after-school-activity] Database insert failed.', { code: error.code });
      return NextResponse.json(
        { success: false, error: 'Unable to submit your enquiry. Please try again.' },
        { status: 500 },
      );
    }
  } catch {
    console.error('[api/after-school-activity] Unexpected submission failure.');
    return NextResponse.json(
      { success: false, error: 'Unable to submit your enquiry. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: 'Enquiry submitted successfully.' },
    { status: 201 },
  );
}
