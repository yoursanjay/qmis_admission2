import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/serverSupabase';
import { isValidEmail, normalizeIndianPhone, readString } from '@/lib/apiValidation';

export const runtime = 'nodejs';

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'text/rtf',
]);
const ALLOWED_RESUME_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'txt', 'rtf']);

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

function serverError() {
  return NextResponse.json(
    { success: false, error: 'Unable to submit your application. Please try again.' },
    { status: 500 },
  );
}

function safeFilename(filename) {
  const name = filename.split(/[\\/]/).pop() || 'resume';
  const sanitized = name.replace(/[^\w.-]/g, '_').slice(-120);
  return sanitized || 'resume';
}

export async function POST(request) {
  let fields;
  try {
    fields = await request.formData();
  } catch {
    return badRequest('Expected multipart form data.');
  }

  const name = readString(fields.get('name'));
  const email = readString(fields.get('email'));
  const rawPhone = readString(fields.get('phone'));
  const position = readString(fields.get('position'));
  const educationQualification = readString(fields.get('education_qualification'));
  const gender = readString(fields.get('gender'));
  const address = readString(fields.get('address'));
  const resume = fields.get('resume');

  if (!name) return badRequest('Name is required.');
  if (!email || !isValidEmail(email)) return badRequest('A valid email is required.');
  const phone = normalizeIndianPhone(rawPhone);
  if (!phone) return badRequest('A valid 10-digit phone number is required.');
  if (!position) return badRequest('Position is required.');
  if (!(typeof File !== 'undefined' && resume instanceof File)) {
    return badRequest('Resume is required.');
  }
  if (resume.size === 0) return badRequest('Resume file cannot be empty.');
  if (resume.size > MAX_RESUME_SIZE) return badRequest('Resume file size must be 10MB or less.');

  const extension = resume.name.split('.').pop()?.toLowerCase() || '';
  if (
    !ALLOWED_RESUME_EXTENSIONS.has(extension) ||
    !ALLOWED_RESUME_TYPES.has(resume.type)
  ) {
    return badRequest('Resume must be a PDF, DOC, DOCX, TXT, or RTF file.');
  }

  const supabase = (() => {
    try {
      return getServerSupabaseClient();
    } catch {
      console.error('[api/careers] Supabase server configuration is missing.');
      return null;
    }
  })();
  if (!supabase) return serverError();

  const resumeFileName = safeFilename(resume.name);
  const storagePath = `careers/${randomUUID()}-${resumeFileName}`;
  let uploaded = false;
  try {
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(storagePath, resumeBuffer, {
        contentType: resume.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[api/careers] Resume upload failed.', { code: uploadError.name });
      return serverError();
    }
    uploaded = true;

    const { data: resumeUrlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(storagePath);

    const { error: insertError } = await supabase.from('careers_applications').insert({
      name,
      email,
      phone,
      position,
      education_qualification: educationQualification,
      gender,
      address,
      resume_url: resumeUrlData.publicUrl,
      resume_file_name: resumeFileName,
      resume_file_size: resume.size,
      resume_file_type: resume.type,
    });

    if (insertError) {
      await removeUploadedResume(supabase, storagePath);
      uploaded = false;
      console.error('[api/careers] Application insert failed.', { code: insertError.code });
      return serverError();
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.' },
      { status: 201 },
    );
  } catch {
    if (uploaded) await removeUploadedResume(supabase, storagePath);
    console.error('[api/careers] Unexpected application submission failure.');
    return serverError();
  }
}

async function removeUploadedResume(supabase, storagePath) {
  try {
    const { error } = await supabase.storage.from('resumes').remove([storagePath]);
    if (error) {
      console.error('[api/careers] Uploaded resume cleanup failed.', { code: error.name });
    }
  } catch {
    console.error('[api/careers] Uploaded resume cleanup failed.');
  }
}
