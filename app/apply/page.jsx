'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { sendOtp, verifyOtp, submitLead } from '@/lib/admissionApi';
import { openRazorpayPaymentButton } from '@/lib/razorpay';

// ─── Constants ────────────────────────────────────────────────────────────────

const RELATIONSHIP_TYPES = ['Father', 'Mother', 'Guardian'];

const GRADE_OPTIONS = [
  'Pre KG', 'KG 1', 'KG 2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12',
];

const INCOME_OPTIONS = [
  'Less than ₹5 Lakhs', '₹5 - ₹10 Lakhs', '₹10 - ₹20 Lakhs',
  '₹20 - ₹50 Lakhs', '₹50 Lakhs - ₹1 Crore', 'Above ₹1 Crore',
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const GUARDIAN_RELATIONSHIPS = [
  'Uncle', 'Aunt', 'Grandparent', 'Elder Sibling', 'Legal Guardian', 'Other',
];

const SOURCE_OPTIONS = ['Social Media', 'Referral', 'Website', 'Advertisement', 'Walk-in', 'Other'];
const CAMPAIGN_OPTIONS = ['2025 Admissions', 'Early Bird 2025', 'Summer 2025', 'Other'];

const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 30;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Banner() {
  return (
    <div className="w-full bg-white">
      <Image
        src="/main_banner.jpg"
        alt="Queen Mira International School"
        width={1200}
        height={400}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}

function FormShell({ title, children }) {
  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Banner />
      <div className="py-6 px-4">
        {/* "Register Now For Admissions" pill */}
        <div className="flex justify-center mb-5">
          <span className="bg-[#1a2252] text-white text-sm font-medium px-6 py-2 rounded-full shadow">
            Register Now For Admissions
          </span>
        </div>

        {/* White card */}
        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6">
          {title && (
            <h2 className="text-center text-[#1a2252] font-bold text-lg mb-5">{title}</h2>
          )}
          {children}
        </div>

      </div>
    </div>
  );
}

function InputField({ label, required, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, children, onClick, type = 'submit', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 bg-[#1a2252] hover:bg-[#0f1840] text-white font-semibold py-2.5 px-6 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}

function PhoneInput({ value, onChange, disabled }) {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#1a2252]">
      <div className="flex items-center gap-1 px-3 bg-gray-50 border-r border-gray-300 text-sm text-gray-700 whitespace-nowrap">
        🇮🇳 +91
      </div>
      <input
        type="tel"
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={10}
        placeholder="0000000000"
        className="flex-1 px-3 py-2.5 text-sm outline-none bg-white disabled:bg-gray-50"
      />
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a2252] mb-4 transition-colors"
    >
      ← Back
    </button>
  );
}

function SignInLink({ onClick }) {
  return (
    <p className="text-center text-sm text-gray-600 mt-4">
      If you already have an account{' '}
      <button
        type="button"
        onClick={onClick}
        className="text-[#CC0000] font-semibold hover:underline"
      >
        Sign In Here
      </button>
    </p>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [flowMode, setFlowMode] = useState('apply'); // 'apply' | 'signin'
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingLead, setExistingLead] = useState(null);
  const [verificationToken, setVerificationToken] = useState(null);

  // Step 1: Relationship
  const [relationship, setRelationship] = useState('');

  // Step 2: Primary contact details
  const [primaryContact, setPrimaryContact] = useState({ name: '', phone: '', email: '' });
  const [phoneErrors, setPhoneErrors] = useState({});

  // Step 3: OTP
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSentPhone, setOtpSentPhone] = useState('');
  const otpRefs = useRef([]);

  // Step 4: Full lead form
  const [formData, setFormData] = useState({
    father: { name: '', phone: '', email: '', occupation: '', annualIncome: '' },
    mother: { name: '', phone: '', email: '', occupation: '', annualIncome: '' },
    guardian: { name: '', phone: '', email: '', relationship: '', occupation: '', annualIncome: '' },
    project: { campaign: '', source: '', subSource: '' },
  });
  const [children, setChildren] = useState([]);
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChildIndex, setEditingChildIndex] = useState(null);
  const [childForm, setChildForm] = useState({
    name: '', intakeYear: '2026-2027', grade: '', dateOfBirth: '', gender: '',
    address: '', bloodGroup: '', previousSchool: '', reasonForQuitting: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Step 5: Enquiry number
  const [enquiryNumber, setEnquiryNumber] = useState(null);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // ─── OTP countdown ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  useEffect(() => {
    if (currentStep === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [currentStep]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

  const prefillFormFromContact = (rel, contact, lead) => {
    const key = rel.toLowerCase();
    const patch = { name: contact.name, phone: contact.phone, email: contact.email };
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
      // If existing lead, map all fields
      ...(lead ? {
        father: {
          name: lead.father_name || '', phone: lead.father_phone || '',
          email: lead.father_email || '', occupation: lead.father_occupation || '',
          annualIncome: lead.father_annual_income || '',
        },
        mother: {
          name: lead.mother_name || '', phone: lead.mother_phone || '',
          email: lead.mother_email || '', occupation: lead.mother_occupation || '',
          annualIncome: lead.mother_annual_income || '',
        },
        guardian: {
          name: lead.guardian_name || '', phone: lead.guardian_phone || '',
          email: lead.guardian_email || '', relationship: lead.guardian_relationship || '',
          occupation: lead.guardian_occupation || '', annualIncome: lead.guardian_annual_income || '',
        },
        project: {
          campaign: lead.campaign || '', source: lead.source || '',
          subSource: lead.sub_source || '',
        },
      } : {}),
    }));

    if (lead?.children?.length) {
      setChildren(lead.children.map((c) => ({
        id: c.id, name: c.name || '', intakeYear: c.intake_year || '2026-2027',
        grade: c.grade || '', dateOfBirth: c.date_of_birth || '',
        gender: c.gender || '', address: c.address || '',
        bloodGroup: c.blood_group || '', previousSchool: c.previous_school || '',
        reasonForQuitting: c.reason_for_quitting || '',
      })));
    }
  };

  // ─── Step 1: Intro ──────────────────────────────────────────────────────────
  const handleIntroSubmit = (e) => {
    e.preventDefault();
    if (!relationship) { setApiError('Please select your relationship with the child.'); return; }
    setApiError('');
    setCurrentStep('phone');
  };

  const handleSignIn = () => {
    setFlowMode('signin');
    setCurrentStep('signin');
  };

  // ─── Step 1b: Sign In ────────────────────────────────────────────────────────
  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errors = {};
    if (!primaryContact.phone) errors.phone = 'Phone number is required';
    else if (!validatePhone(primaryContact.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
    if (Object.keys(errors).length) { setPhoneErrors(errors); return; }
    setPhoneErrors({});

    const rel = relationship || 'Father';
    setLoading(true);
    try {
      setIsExistingUser(false);
      setExistingLead(null);
      await sendOtp(primaryContact.phone);
      setOtpSentPhone(primaryContact.phone);
      setOtpCountdown(OTP_RESEND_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
      prefillFormFromContact(rel, primaryContact, null);
      setCurrentStep('otp');
    } catch (err) {
      setApiError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Phone ──────────────────────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errors = {};
    if (!primaryContact.name.trim()) errors.name = 'Name is required';
    if (!primaryContact.phone) errors.phone = 'Phone number is required';
    else if (!validatePhone(primaryContact.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
    if (Object.keys(errors).length) { setPhoneErrors(errors); return; }
    setPhoneErrors({});

    setLoading(true);
    try {
      setIsExistingUser(false);
      setExistingLead(null);
      await sendOtp(primaryContact.phone);
      setOtpSentPhone(primaryContact.phone);
      setOtpCountdown(OTP_RESEND_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
      prefillFormFromContact(relationship, primaryContact, null);
      setCurrentStep('otp');
    } catch (err) {
      setApiError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: OTP ────────────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleOtpVerify = async () => {
    const otp = otpDigits.join('');
    if (otp.length < OTP_LENGTH) { setOtpError('Please enter the complete OTP'); return; }
    setOtpError('');
    setApiError('');
    setLoading(true);
    try {
      const verification = await verifyOtp(otpSentPhone, otp);
      setVerificationToken(verification.token);
      setCurrentStep('lead_form');
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    setApiError('');
    setLoading(true);
    try {
      await sendOtp(otpSentPhone);
      setOtpCountdown(OTP_RESEND_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
    } catch (err) {
      setApiError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = async () => {
    if (paymentLoading) return;
    setPaymentError('');
    setPaymentLoading(true);
    try {
      await openRazorpayPaymentButton();
    } catch (err) {
      setPaymentError(err.message || 'Payment could not be started. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Step 4: Lead Form ──────────────────────────────────────────────────────
  const updateFormField = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const validateLeadForm = () => {
    const errors = {};
    if (!formData.father.name.trim()) errors['father.name'] = 'Father name is required';
    if (!formData.father.phone.trim()) errors['father.phone'] = 'Father phone is required';
    else if (!validatePhone(formData.father.phone)) errors['father.phone'] = 'Invalid phone number';
    if (children.length === 0) errors.children = 'Please add at least one child';
    return errors;
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLeadForm();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setApiError('');
    setLoading(true);

    try {
      if (!verificationToken) {
        throw new Error('Please verify the phone number before submitting.');
      }
      const verifiedContactKey = (relationship || 'Father').toLowerCase();
      if (formData[verifiedContactKey]?.phone !== otpSentPhone) {
        throw new Error('The verified phone number cannot be changed before submission.');
      }
      const res = await submitLead({
        verificationToken,
        leadData: formData,
        children,
        addedBy: 'Admission Portal',
        ...(isExistingUser && existingLead ? { leadId: existingLead.id } : {}),
      });
      setEnquiryNumber(res.applicationNo || res.lead?.application_no);
      setCurrentStep('step5');
    } catch (err) {
      if (err.status === 409) {
        setEnquiryNumber(err.data?.existingLead?.application_no);
        setCurrentStep('step5');
      } else {
        setApiError(err.message || 'Submission failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Child form helpers ─────────────────────────────────────────────────────
  const openChildForm = (index = null) => {
    if (index !== null) {
      setChildForm({ ...children[index] });
      setEditingChildIndex(index);
    } else {
      setChildForm({
        name: '', intakeYear: '2026-2027', grade: '', dateOfBirth: '', gender: '',
        address: '', bloodGroup: '', previousSchool: '', reasonForQuitting: '',
      });
      setEditingChildIndex(null);
    }
    setShowChildForm(true);
  };

  const saveChild = () => {
    if (!childForm.name.trim()) return;
    if (editingChildIndex !== null) {
      setChildren((prev) => prev.map((c, i) => i === editingChildIndex ? { ...childForm } : c));
    } else {
      setChildren((prev) => [...prev, { ...childForm }]);
    }
    setShowChildForm(false);
    setFormErrors((prev) => { const e = { ...prev }; delete e.children; return e; });
  };

  const removeChild = (index) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Renders ─────────────────────────────────────────────────────────────────

  // ── Step 1: Intro ────────────────────────────────────────────────────────────
  if (currentStep === 'intro') {
    return (
      <FormShell title="Sign Up for Admissions">
        <form onSubmit={handleIntroSubmit}>
          <InputField label="Relationship With Child" required error={apiError}>
            <select
              value={relationship}
              onChange={(e) => { setRelationship(e.target.value); setApiError(''); }}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]"
            >
              <option value="">Select The Relation Type</option>
              {RELATIONSHIP_TYPES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </InputField>

          <SubmitButton loading={false}>
            Submit →
          </SubmitButton>
        </form>

        <SignInLink onClick={handleSignIn} />
      </FormShell>
    );
  }

  // ── Step 1b: Sign In ─────────────────────────────────────────────────────────
  if (currentStep === 'signin') {
    return (
      <div className="min-h-screen bg-[#f0f0f0]">
        <Banner />

        <div className="py-6 px-4">
          <div className="flex justify-center mb-5">
            <span className="bg-[#1a2252] text-white text-sm font-medium px-6 py-2 rounded-full shadow">
              Register Now For Admissions
            </span>
          </div>

          <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-center text-[#1a2252] font-bold text-lg mb-5">Sign In</h2>

            <BackButton onClick={() => { setFlowMode('apply'); setCurrentStep('intro'); }} />

            <form onSubmit={handleSigninSubmit} noValidate>
              <InputField label="Phone Number" required error={phoneErrors.phone}>
                <PhoneInput
                  value={primaryContact.phone}
                  onChange={(e) => setPrimaryContact((p) => ({ ...p, phone: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the WhatsApp number you registered with
                </p>
              </InputField>

              {apiError && (
                <p className={`text-xs mb-3 p-2 rounded ${apiError.startsWith('Demo') ? 'bg-blue-50 text-blue-700' : 'text-red-600 bg-red-50'}`}>
                  {apiError}
                </p>
              )}

              <SubmitButton loading={loading}>Send OTP →</SubmitButton>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // ── Step 2: Phone ────────────────────────────────────────────────────────────
  if (currentStep === 'phone') {
    const label = relationship || 'Parent';
    const isGuardian = relationship === 'Guardian';

    return (
      <FormShell title={flowMode === 'signin' ? 'Sign In' : 'Sign Up for Admissions'}>
        <BackButton onClick={() => setCurrentStep('intro')} />

        <form onSubmit={handlePhoneSubmit} noValidate>
          <InputField label="Relationship With Child">
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]"
            >
              {RELATIONSHIP_TYPES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </InputField>

          <InputField label={`${label}'s Name`} required error={phoneErrors.name}>
            <input
              type="text"
              value={primaryContact.name}
              onChange={(e) => setPrimaryContact((p) => ({ ...p, name: e.target.value }))}
              placeholder={`Enter ${label.toLowerCase()} name`}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]"
            />
          </InputField>

          <InputField label={`${label}'s Phone Number`} required error={phoneErrors.phone}>
            <PhoneInput
              value={primaryContact.phone}
              onChange={(e) => setPrimaryContact((p) => ({ ...p, phone: e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter your WhatsApp number to receive your child&apos;s application and other resources
            </p>
          </InputField>

          <InputField label={`${label}'s Email`} error={phoneErrors.email}>
            <input
              type="email"
              value={primaryContact.email}
              onChange={(e) => setPrimaryContact((p) => ({ ...p, email: e.target.value }))}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]"
            />
          </InputField>

          {isGuardian && (
            <InputField label="Guardian's Relationship to Child">
              <select
                value={primaryContact.guardianRelationship || ''}
                onChange={(e) => setPrimaryContact((p) => ({ ...p, guardianRelationship: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]"
              >
                <option value="">Select relationship</option>
                {GUARDIAN_RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </InputField>
          )}

          {apiError && (
            <p className={`text-xs mb-3 p-2 rounded ${apiError.startsWith('Demo') ? 'bg-blue-50 text-blue-700' : 'text-red-600 bg-red-50'}`}>
              {apiError}
            </p>
          )}

          <SubmitButton loading={loading}>Submit →</SubmitButton>
        </form>

        <SignInLink onClick={() => { setFlowMode('signin'); }} />
      </FormShell>
    );
  }

  // ── Step 3: OTP ──────────────────────────────────────────────────────────────
  if (currentStep === 'otp') {
    return (
      <FormShell>
        <BackButton onClick={() => setCurrentStep(flowMode === 'signin' ? 'signin' : 'phone')} />

        <h2 className="text-center text-[#1a2252] font-bold text-base mb-1">Enter Whatsapp Otp</h2>
        <p className="text-center text-xs text-gray-400 mb-5">
          Sent to +91 {otpSentPhone}
        </p>

        {apiError && (
          <p className={`text-xs mb-3 p-2 rounded text-center ${apiError.startsWith('Demo') ? 'bg-blue-50 text-blue-700' : 'text-red-600 bg-red-50'}`}>
            {apiError}
          </p>
        )}

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-5" onPaste={handleOtpPaste}>
          {otpDigits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2252] transition-colors"
            />
          ))}
        </div>

        {otpError && <p className="text-red-500 text-xs text-center mb-3">{otpError}</p>}

        <SubmitButton
          loading={loading}
          type="button"
          onClick={handleOtpVerify}
          className="!bg-green-600 hover:!bg-green-700"
        >
          Verify OTP &amp; Login
        </SubmitButton>

        <div className="text-center mt-3">
          {otpCountdown > 0 ? (
            <span className="text-xs text-gray-400">Resend in {otpCountdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm text-[#CC0000] hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>
      </FormShell>
    );
  }

  // ── Step 4: Lead Form ────────────────────────────────────────────────────────
  if (currentStep === 'lead_form') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Slim top bar instead of banner on form step */}
        <div className="bg-[#1a2252] py-3 px-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#CC0000] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs">QM</span>
          </div>
          <span className="text-white text-sm font-semibold">Queen Mira International School — Admission Form</span>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <BackButton onClick={() => setCurrentStep(
            isExistingUser ? (flowMode === 'signin' ? 'signin' : 'phone') : 'otp'
          )} />

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
            {['Contact Details', 'Verify Phone', 'Application Form', 'Done'].map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i < 2 ? 'bg-green-500 text-white' : i === 2 ? 'bg-[#1a2252] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i < 2 ? '✓' : i + 1}
                </span>
                <span className={i === 2 ? 'font-semibold text-[#1a2252]' : ''}>{label}</span>
                {i < 3 && <span className="text-gray-300">›</span>}
              </div>
            ))}
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleLeadSubmit} noValidate>
            {/* ── Father Details ── */}
            <section className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <h3 className="font-bold text-[#1a2252] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1a2252] text-white text-xs flex items-center justify-center">F</span>
                Father&apos;s Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Father's Name" required error={formErrors['father.name']}>
                  <input type="text" value={formData.father.name}
                    onChange={(e) => updateFormField('father', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Father's Phone" required error={formErrors['father.phone']}>
                  <PhoneInput value={formData.father.phone}
                    onChange={(e) => updateFormField('father', 'phone', e.target.value)} />
                </InputField>
                <InputField label="Father's Email">
                  <input type="email" value={formData.father.email}
                    onChange={(e) => updateFormField('father', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Occupation">
                  <input type="text" value={formData.father.occupation}
                    onChange={(e) => updateFormField('father', 'occupation', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Annual Income">
                  <select value={formData.father.annualIncome}
                    onChange={(e) => updateFormField('father', 'annualIncome', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select range</option>
                    {INCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </InputField>
              </div>
            </section>

            {/* ── Mother Details ── */}
            <section className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <h3 className="font-bold text-[#1a2252] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">M</span>
                Mother&apos;s Details
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Mother's Name">
                  <input type="text" value={formData.mother.name}
                    onChange={(e) => updateFormField('mother', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Mother's Phone">
                  <PhoneInput value={formData.mother.phone}
                    onChange={(e) => updateFormField('mother', 'phone', e.target.value)} />
                </InputField>
                <InputField label="Mother's Email">
                  <input type="email" value={formData.mother.email}
                    onChange={(e) => updateFormField('mother', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Occupation">
                  <input type="text" value={formData.mother.occupation}
                    onChange={(e) => updateFormField('mother', 'occupation', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Annual Income">
                  <select value={formData.mother.annualIncome}
                    onChange={(e) => updateFormField('mother', 'annualIncome', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select range</option>
                    {INCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </InputField>
              </div>
            </section>

            {/* ── Guardian Details ── */}
            <section className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <h3 className="font-bold text-[#1a2252] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">G</span>
                Guardian&apos;s Details
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Guardian's Name">
                  <input type="text" value={formData.guardian.name}
                    onChange={(e) => updateFormField('guardian', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Guardian's Phone">
                  <PhoneInput value={formData.guardian.phone}
                    onChange={(e) => updateFormField('guardian', 'phone', e.target.value)} />
                </InputField>
                <InputField label="Guardian's Email">
                  <input type="email" value={formData.guardian.email}
                    onChange={(e) => updateFormField('guardian', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Relationship to Child">
                  <select value={formData.guardian.relationship}
                    onChange={(e) => updateFormField('guardian', 'relationship', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select relationship</option>
                    {GUARDIAN_RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </InputField>
                <InputField label="Occupation">
                  <input type="text" value={formData.guardian.occupation}
                    onChange={(e) => updateFormField('guardian', 'occupation', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
                <InputField label="Annual Income">
                  <select value={formData.guardian.annualIncome}
                    onChange={(e) => updateFormField('guardian', 'annualIncome', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select range</option>
                    {INCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </InputField>
              </div>
            </section>

            {/* ── Project / Source ── */}
            <section className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <h3 className="font-bold text-[#1a2252] mb-4">How Did You Hear About Us?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Campaign">
                  <select value={formData.project.campaign}
                    onChange={(e) => updateFormField('project', 'campaign', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select campaign</option>
                    {CAMPAIGN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </InputField>
                <InputField label="Source">
                  <select value={formData.project.source}
                    onChange={(e) => updateFormField('project', 'source', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                    <option value="">Select source</option>
                    {SOURCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </InputField>
                <InputField label="Sub-Source">
                  <input type="text" value={formData.project.subSource}
                    onChange={(e) => updateFormField('project', 'subSource', e.target.value)}
                    placeholder="e.g. Instagram, Friend's name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                </InputField>
              </div>
            </section>

            {/* ── Children ── */}
            <section className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a2252]">
                  Child Details
                  <span className="text-red-500 ml-0.5">*</span>
                </h3>
                <button
                  type="button"
                  onClick={() => openChildForm()}
                  className="text-sm bg-[#1a2252] text-white px-3 py-1.5 rounded-md hover:bg-[#0f1840] transition-colors"
                >
                  + Add Child
                </button>
              </div>

              {formErrors.children && (
                <p className="text-red-500 text-xs mb-3">{formErrors.children}</p>
              )}

              {children.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No children added yet.</p>
              ) : (
                <div className="space-y-2">
                  {children.map((child, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{child.name}</p>
                        <p className="text-xs text-gray-500">{child.grade} · {child.intakeYear}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openChildForm(i)}
                          className="text-xs text-[#1a2252] hover:underline">Edit</button>
                        <button type="button" onClick={() => removeChild(i)}
                          className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Submit */}
            <SubmitButton loading={loading}>
              Submit Application →
            </SubmitButton>
          </form>

          {/* Child Form Modal */}
          {showChildForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1a2252]">
                    {editingChildIndex !== null ? 'Edit Child' : 'Add Child'}
                  </h3>
                  <button type="button" onClick={() => setShowChildForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Child's Name", field: 'name', required: true, type: 'text', col: 2 },
                    { label: 'Grade', field: 'grade', type: 'select', options: GRADE_OPTIONS, required: true },
                    { label: 'Intake Year', field: 'intakeYear', type: 'text' },
                    { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
                    { label: 'Gender', field: 'gender', type: 'select', options: GENDER_OPTIONS },
                    { label: 'Blood Group', field: 'bloodGroup', type: 'select', options: BLOOD_GROUP_OPTIONS },
                    { label: 'Previous School', field: 'previousSchool', type: 'text', col: 2 },
                    { label: 'Reason for Quitting', field: 'reasonForQuitting', type: 'text', col: 2 },
                    { label: 'Address', field: 'address', type: 'text', col: 2 },
                  ].map(({ label, field, type, options, required, col }) => (
                    <div key={field} className={col === 2 ? 'col-span-2' : ''}>
                      <label className="block text-xs text-gray-600 mb-1">
                        {label}{required && <span className="text-red-500">*</span>}
                      </label>
                      {type === 'select' ? (
                        <select value={childForm[field]}
                          onChange={(e) => setChildForm((p) => ({ ...p, [field]: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2252]">
                          <option value="">Select</option>
                          {options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={type} value={childForm[field]}
                          onChange={(e) => setChildForm((p) => ({ ...p, [field]: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2252]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowChildForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="button" onClick={saveChild}
                    disabled={!childForm.name.trim()}
                    className="flex-1 bg-[#1a2252] text-white py-2 rounded-md text-sm hover:bg-[#0f1840] disabled:opacity-50">
                    Save Child
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Step 5: Thank You ────────────────────────────────────────────────────────
  if (currentStep === 'step5') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Handshake icon */}
        <div className="mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 10 L35 8 L20 18 L15 22 L18 30 L25 28 L30 32" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M40 10 L45 8 L60 18 L65 22 L62 30 L55 28 L50 32" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M30 32 L40 40 L50 32" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M25 28 L30 32 L40 40 L50 32 L55 28" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M38 5 L40 0 L42 5" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M32 3 L33 7" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M48 3 L47 7" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="40" cy="40" r="18" stroke="#111" strokeWidth="2.5" fill="none" />
            <path d="M32 40 L38 46 L50 34" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <h2 className="text-[#CC0000] font-bold text-xl mb-2">
          Thank you for joining the QMIS Family! 🎉
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          We&apos;re delighted to confirm your successful registration
        </p>

        {enquiryNumber && (
          <p className="text-[#CC0000] font-bold text-base mb-5">
            your unique enquiry number is <span className="text-[#1a2252]">{enquiryNumber}</span>
          </p>
        )}

        <p className="text-sm text-gray-600 mb-3 max-w-sm">
          To proceed with your child&apos;s enrollment journey, the next step is to purchase and
          submit your application. This will give you access to:
        </p>
        <ul className="text-sm text-gray-700 text-left space-y-1.5 mb-6 max-w-xs">
          {['A complete breakdown of school fees', 'Our full suite of educational resources', 'Important admission documentation'].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>{item}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setCurrentStep('step6')}
          className="bg-[#CC0000] hover:bg-[#990000] text-white font-semibold px-8 py-2.5 rounded-md transition-colors"
        >
          Next
        </button>

      </div>
    );
  }

  // ── Step 6: Safety Info ──────────────────────────────────────────────────────
  if (currentStep === 'step6') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Crayons icon */}
        <div className="mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="10" width="12" height="60" rx="3" stroke="#111" strokeWidth="2.5" fill="none" />
            <rect x="35" y="10" width="12" height="60" rx="3" stroke="#111" strokeWidth="2.5" fill="none" />
            <rect x="50" y="10" width="12" height="60" rx="3" stroke="#111" strokeWidth="2.5" fill="none" />
            <rect x="65" y="10" width="12" height="60" rx="3" stroke="#111" strokeWidth="2.5" fill="none" />
            <polygon points="20,70 32,70 30,82 22,82" stroke="#111" strokeWidth="2" fill="none" />
            <polygon points="35,70 47,70 45,82 37,82" stroke="#111" strokeWidth="2" fill="none" />
            <polygon points="50,70 62,70 60,82 52,82" stroke="#111" strokeWidth="2" fill="none" />
            <polygon points="65,70 77,70 75,82 67,82" stroke="#111" strokeWidth="2" fill="none" />
            <rect x="18" y="55" width="62" height="18" rx="8" stroke="#111" strokeWidth="2" fill="none" />
            <ellipse cx="38" cy="64" rx="3" ry="3" stroke="#111" strokeWidth="1.5" fill="none" />
            <path d="M36 64 Q38 67 40 64" stroke="#111" strokeWidth="1.5" fill="none" />
            <ellipse cx="58" cy="64" rx="3" ry="3" stroke="#111" strokeWidth="1.5" fill="none" />
            <path d="M56 64 Q58 67 60 64" stroke="#111" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <p className="text-[#CC0000] font-semibold text-base mb-4 max-w-md">
          Choosing the right school can feel overwhelming, but we&apos;re here to make it easier.
        </p>

        <p className="text-[#1a2252] font-bold text-base mb-4">
          At QMIS, Safety isn&apos;t just a priority, it&apos;s a promise.
        </p>

        <ul className="text-sm text-gray-700 text-left space-y-2 mb-8 max-w-xs">
          {['Physical safety', 'Mental Well-being', 'Transport safety', 'COVID-19 safety norms'].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>{item}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setCurrentStep('step7')}
          className="bg-[#CC0000] hover:bg-[#990000] text-white font-semibold px-8 py-2.5 rounded-md transition-colors"
        >
          Next
        </button>

      </div>
    );
  }

  // ── Step 7: Payment ──────────────────────────────────────────────────────────
  if (currentStep === 'step7') {
    const perks = [
      'Complete fee structure & schemes',
      'Exclusive parent guidebook: A comparative analysis of schools in Madurai.',
      'Free subscription to the school newsletter.',
      'Scholarship benefits for academic achievers and sports stars.',
      'Family benefits for siblings and parent referrals.',
      'One-time payment option with yearly payment advantages.',
    ];

    return (
      <div className="min-h-screen bg-[#1a2252] flex flex-col px-4 py-6">
        {/* Logo top left */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-[#1a2252] font-black text-xs leading-none">QM</span>
          </div>
          <div className="text-white text-xs leading-tight">
            <div className="font-bold">queen mira</div>
            <div>international</div>
            <div>school</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
          <p className="text-white text-sm mb-6 max-w-lg">
            You are just one step away from accessing a bundle of perks offered by Queen Mira.
          </p>

          <div className="w-full border-t border-white/20 pt-6 mb-4">
            <p className="text-white text-4xl font-bold mb-2">₹ 299</p>
            <p className="text-white/70 text-sm mb-6">
              Apply now to receive parent handbooks &amp; guidance documents curated by our career counsellors.
            </p>
          </div>

          {/* Perks grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mb-8 w-full text-left border-t border-white/20 pt-6">
            {perks.map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <span className="text-green-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                <span className="text-white/80 text-xs">{perk}</span>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-white/20 pt-4 pb-4 mb-4">
            <p className="text-white/50 text-xs">
              By applying you agree to our{' '}
              <span className="underline cursor-pointer text-blue-300">User Agreement</span>,{' '}
              <span className="underline cursor-pointer text-blue-300">Privacy Policy</span>, and{' '}
              <span className="underline cursor-pointer text-blue-300">Cookie Policy</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePaymentClick}
            disabled={paymentLoading}
            className="w-full max-w-lg bg-[#CC0000] hover:bg-[#990000] text-white font-bold py-3.5 rounded-md transition-colors tracking-widest text-sm uppercase disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {paymentLoading ? 'Opening payment...' : 'APPLY NOW'}
          </button>
          {paymentError && (
            <p role="alert" className="text-red-200 text-sm mt-3">{paymentError}</p>
          )}

        </div>
      </div>
    );
  }

  return null;
}
