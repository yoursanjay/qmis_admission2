const productionBaseUrl = 'https://portal.qmis.edu.in';
const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const staleProductionUrl = configuredBaseUrl === 'https://qmis-dashboard.vercel.app';
const BASE_URL = (!configuredBaseUrl || staleProductionUrl) && process.env.NODE_ENV === 'production'
  ? productionBaseUrl
  : configuredBaseUrl || 'http://localhost:5001';

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const responseText = await res.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(`API request failed with status ${res.status}.`);
  }
  if (!res.ok) {
    throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  }
  return data;
}

export async function checkPhoneExists(phone) {
  return apiPost('/api/leads/check', { phoneNumber: phone });
}

export function normalizeWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  throw new Error('Invalid phone number.');
}

function generateOtp() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return String(values[0] % 1000000).padStart(6, '0');
}

export async function sendAskEvaOtp(phone) {
  const otp = generateOtp();
  const token = process.env.NEXT_PUBLIC_ASKEVA_TOKEN;
  if (!token) {
    throw new Error('OTP service is not configured.');
  }

  const url = new URL('https://backend.askeva.io/v1/message/send-message');
  url.searchParams.set('token', token);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: normalizeWhatsAppNumber(phone),
      type: 'template',
      template: {
        language: { policy: 'deterministic', code: 'en' },
        name: 'login_otp',
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: otp }],
          },
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

  const responseText = await res.text();
  let responseData;
  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw Object.assign(new Error('OTP service returned an invalid response.'), { status: res.status });
  }
  if (!res.ok) {
    throw Object.assign(new Error('OTP service could not send the code.'), {
      status: res.status,
      data: responseData,
    });
  }
  if (!responseData || typeof responseData !== 'object') {
    throw Object.assign(new Error('OTP service returned an invalid response.'), { status: res.status });
  }
  return { otp };
}

export async function submitLead({ verificationToken, leadData, children, addedBy }) {
  return apiPost('/api/leads/create', {
    verificationToken,
    leadData,
    children: children || [],
    addedBy: addedBy || 'Admission Portal',
  });
}

/**
 * Generate a bypass token for existing users (no OTP needed).
 * The qmis_dashboard token is plain base64-JSON with no HMAC,
 * so we can create a valid one client-side for existing-user updates.
 */
export function makeBypassToken(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  const payload = {
    phone: cleanPhone,
    verifiedAt: new Date().toISOString(),
    otpId: 'existing-user-bypass',
    exp: Date.now() + 30 * 60 * 1000,
  };
  return btoa(JSON.stringify(payload));
}
