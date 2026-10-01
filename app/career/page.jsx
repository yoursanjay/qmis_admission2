'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, FileText, LoaderCircle, UploadCloud, X } from 'lucide-react';

const API_URL = '/api/careers';

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  position: '',
  education_qualification: '',
  gender: '',
  address: '',
};

function formatFileSize(size) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getFileType(file) {
  if (file.type) return file.type;
  const extension = file.name.split('.').pop();
  return extension ? extension.toUpperCase() : 'Unknown file type';
}

function FormField({ label, name, type = 'text', placeholder, value, onChange, error, inputMode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-[#17244f]">
        {label} <span className="text-[#CC0000]">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/15 ${
          error ? 'border-[#CC0000]' : 'border-gray-300'
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-[#CC0000]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CareerPage() {
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const acceptResume = (file) => {
    if (!file) return;
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      setResume(null);
      setErrors((current) => ({
        ...current,
        resume: 'Please upload a valid resume file (PDF, DOC, DOCX, TXT, or RTF).',
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      setResume(null);
      setErrors((current) => ({ ...current, resume: 'Resume file size must be 10MB or less.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setResume(file);
    setErrors((current) => ({ ...current, resume: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone)) {
      nextErrors.phone = 'Phone number must contain exactly 10 digits.';
    }
    if (!form.position.trim()) nextErrors.position = 'Position is required.';
    if (!form.education_qualification.trim()) {
      nextErrors.education_qualification = 'Education qualification is required.';
    }
    if (!form.address.trim()) nextErrors.address = 'Address is required.';
    if (!resume) nextErrors.resume = 'Resume is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please correct the errors in the form.' });
      return;
    }

    const payload = new FormData();
    payload.append('name', form.name.trim());
    payload.append('email', form.email.trim());
    payload.append('phone', `+91${form.phone}`);
    payload.append('position', form.position.trim());
    payload.append('education_qualification', form.education_qualification.trim());
    payload.append('gender', form.gender);
    payload.append('address', form.address.trim());
    payload.append('resume', resume);

    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, { method: 'POST', body: payload });
      if (!response.ok) {
        throw new Error(`Application submission failed (${response.status}). Please try again.`);
      }
      setIsSubmitted(true);
      setToast({ type: 'success', message: 'Your application was submitted successfully.' });
    } catch (error) {
      setToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to submit your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAnotherApplication = () => {
    setForm(initialForm);
    setResume(null);
    setErrors({});
    setIsSubmitted(false);
    setToast(null);
    if (formRef.current) formRef.current.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-[#17244f] sm:px-6 sm:py-14">
        <section className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-4xl">
            {isSubmitted ? (
              <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
                <CheckCircle size={58} className="mx-auto text-green-600" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-bold text-navy sm:text-3xl">
                  Application Submitted!
                </h2>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                  Thank you for applying to Queen Mira International School. We will review your
                  application and contact you soon.
                </p>
                <button
                  type="button"
                  onClick={startAnotherApplication}
                  className="mt-7 rounded-md bg-[#CC0000] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#990000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CC0000]"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
                  Apply to Join QMIS
                </h2>
                <p className="mt-3 text-center text-sm text-gray-600">
                  Complete the form below to submit your application.
                </p>
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 space-y-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      label="Name"
                      name="name"
                      placeholder="Enter Name"
                      value={form.name}
                      onChange={updateField}
                      error={errors.name}
                    />
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                      value={form.email}
                      onChange={updateField}
                      error={errors.email}
                    />
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#17244f]">
                        Phone Number <span className="text-[#CC0000]">*</span>
                      </label>
                      <div
                        className={`flex overflow-hidden rounded-md border bg-white focus-within:border-[#CC0000] focus-within:ring-2 focus-within:ring-[#CC0000]/15 ${
                          errors.phone ? 'border-[#CC0000]' : 'border-gray-300'
                        }`}
                      >
                        <span className="flex shrink-0 items-center border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-700">
                          🇮🇳 +91
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number"
                          value={form.phone}
                          onChange={updateField}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
                        />
                      </div>
                      {errors.phone && (
                        <p id="phone-error" className="mt-1.5 text-sm text-[#CC0000]">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <FormField
                      label="Position"
                      name="position"
                      placeholder="Enter Position"
                      value={form.position}
                      onChange={updateField}
                      error={errors.position}
                    />
                    <FormField
                      label="Education Qualification"
                      name="education_qualification"
                      placeholder="Enter Qualification"
                      value={form.education_qualification}
                      onChange={updateField}
                      error={errors.education_qualification}
                    />
                    <div>
                      <label htmlFor="gender" className="mb-2 block text-sm font-semibold text-[#17244f]">
                        Gender <span className="text-[#CC0000]">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={updateField}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/15"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="mb-2 block text-sm font-semibold text-[#17244f]">
                        Address <span className="text-[#CC0000]">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={4}
                        placeholder="Enter Address"
                        value={form.address}
                        onChange={updateField}
                        aria-invalid={Boolean(errors.address)}
                        aria-describedby={errors.address ? 'address-error' : undefined}
                        className={`w-full resize-y rounded-md border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/15 ${
                          errors.address ? 'border-[#CC0000]' : 'border-gray-300'
                        }`}
                      />
                      {errors.address && (
                        <p id="address-error" className="mt-1.5 text-sm text-[#CC0000]">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[#17244f]">
                        Upload Your Resume <span className="text-[#CC0000]">*</span>
                      </label>
                      <input
                        ref={fileInputRef}
                        id="resume-upload"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
                        className="sr-only"
                        onChange={(event) => acceptResume(event.target.files?.[0])}
                        aria-describedby={errors.resume ? 'resume-error' : 'resume-help'}
                      />
                      <label
                        htmlFor="resume-upload"
                        onDragEnter={(event) => {
                          event.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                          event.preventDefault();
                          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          setIsDragging(false);
                          acceptResume(event.dataTransfer.files?.[0]);
                        }}
                        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-5 py-7 text-center transition ${
                          isDragging
                            ? 'border-[#CC0000] bg-red-50'
                            : errors.resume
                              ? 'border-[#CC0000]'
                              : 'border-gray-300 hover:border-[#CC0000] hover:bg-gray-50'
                        }`}
                      >
                        <UploadCloud size={32} className="text-[#CC0000]" aria-hidden="true" />
                        <span className="mt-3 text-sm font-semibold text-[#17244f]">
                          Click to upload or drag and drop
                        </span>
                        <span id="resume-help" className="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, or RTF (max. 10MB)
                        </span>
                      </label>
                      {resume && (
                        <div className="mt-3 flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                          <FileText size={22} className="shrink-0 text-[#CC0000]" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#17244f]">{resume.name}</p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {getFileType(resume)} · {formatFileSize(resume.size)}
                            </p>
                          </div>
                          <label
                            htmlFor="resume-upload"
                            className="cursor-pointer rounded px-2 py-1 text-xs font-semibold text-[#CC0000] hover:bg-red-50"
                          >
                            Replace
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setResume(null);
                              setErrors((current) => ({ ...current, resume: '' }));
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-[#CC0000]"
                            aria-label="Remove resume"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                      {errors.resume && (
                        <p id="resume-error" className="mt-1.5 text-sm text-[#CC0000]">
                          {errors.resume}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-w-40 items-center justify-center gap-2 rounded-md bg-[#CC0000] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#990000] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CC0000]"
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                          SUBMITTING...
                        </>
                      ) : (
                        'SUBMIT APPLICATION'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      {toast && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed right-4 top-4 z-[60] max-w-sm rounded-md px-5 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'error' ? 'bg-[#CC0000]' : 'bg-green-700'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
