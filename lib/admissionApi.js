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

export async function sendOtp(phone) {
  return apiPost('/api/leads/send-otp', { phoneNumber: phone });
}

export async function verifyOtp(phone, otp) {
  const result = await apiPost('/api/leads/verify-otp', {
    phoneNumber: phone,
    otp,
  });
  if (!result?.token) {
    throw new Error('OTP verification did not return a verification token.');
  }
  return result;
}

export async function submitLead({ verificationToken, leadData, children, addedBy }) {
  return apiPost('/api/leads/create', {
    verificationToken,
    leadData,
    children: children || [],
    addedBy: addedBy || 'Admission Portal',
  });
}

