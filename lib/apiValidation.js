export function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeIndianPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  if (/^91\d{10}$/.test(digits)) return `+${digits}`;
  return null;
}
