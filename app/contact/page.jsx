'use client';

import { useState } from 'react';
import { Loader2, PhoneCall } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  CareerSiteFooter,
  CareerSiteHeader,
} from '@/components/CareerSiteChrome';

const API_URL = '/api';

const APPLY_NOW_URL =
  'https://admissions.qmis.edu.in/?utm_source=Website&utm_medium=popup_form&utm_campaign=BBC&_gl=1%2A11hbug0%2A_ga%2AMTIyNDc1NDU3Ni4xNzY1MDQ3MzAx%2A_ga_K5HD0P2MHT%2AczE3NjU2NDQ5NTkkbzkkZzEkdDE3NjU2NDYwNTEkajYwJGwwJGgw';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  captcha: false,
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  const updatePhone = (event) => {
    let phone = event.target.value.replace(/\D/g, '');
    if (phone.length > 10) phone = phone.slice(0, 10);
    setForm((current) => ({ ...current, phone }));
    if (errors.phone) setErrors((current) => ({ ...current, phone: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (form.name.trim()) {
      if (form.name.trim().length < 2) {
        nextErrors.name = 'Name must be at least 2 characters';
      }
    } else {
      nextErrors.name = 'Name is required';
    }

    if (form.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = 'Please enter a valid email address';
      }
    } else {
      nextErrors.email = 'Email is required';
    }

    if (form.phone.trim()) {
      if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
        nextErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    } else {
      nextErrors.phone = 'Phone number is required';
    }

    if (!form.subject.trim()) nextErrors.subject = 'Subject is required';

    if (form.message.trim()) {
      if (form.message.trim().length < 10) {
        nextErrors.message = 'Message must be at least 10 characters';
      }
    } else {
      nextErrors.message = 'Message is required';
    }

    if (!form.captcha) nextErrors.captcha = 'Please confirm you are human';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitContact = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: `+91${form.phone.replace(/\D/g, '')}`,
        subject: form.subject.trim(),
        message: form.message.trim(),
      };
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Thank you for contacting us! We'll get back to you soon.");
        setForm(initialForm);
        setErrors({});
      } else {
        toast.error(result.error || result.message || 'Failed to submit form. Please try again.');
        if (result.errors) setErrors(result.errors);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedPhone = (digits) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const openApplyNow = () => {
    window.open(APPLY_NOW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <CareerSiteHeader />
      <main className="min-h-screen">
        <div
          className="w-full bg-grid-dots"
          style={{
            backgroundColor: '#f9fafb',
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="mb-6 text-2xl font-bold text-red-700">General Enquiry</h2>
            <div className="grid gap-10 md:grid-cols-2">
              <form onSubmit={submitContact} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    className={`w-full rounded border p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      className={`w-full rounded border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter email"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div
                      className={`flex overflow-hidden rounded-md border focus-within:ring-1 focus-within:ring-gray-300 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <span className="flex items-center border-r bg-gray-100 px-4 text-sm font-medium text-gray-700">
                        +91
                      </span>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formattedPhone(form.phone)}
                        onChange={updatePhone}
                        className="w-full p-2 text-sm outline-none"
                        placeholder="Enter 10-digit number"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={updateField}
                    className={`w-full rounded border p-2 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Subject"
                    disabled={isSubmitting}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={updateField}
                    className={`w-full rounded border p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Your message"
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <div
                  className={`flex items-center gap-3 rounded border p-3 ${
                    errors.captcha ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <input
                    id="contact-captcha"
                    type="checkbox"
                    name="captcha"
                    checked={form.captcha}
                    onChange={updateField}
                    className="h-5 w-5"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="contact-captcha">I am human</label>
                  <div className="ml-auto">
                    <div className="flex h-10 w-24 items-center justify-center rounded bg-gray-200 text-xs">
                      hCaptcha
                    </div>
                  </div>
                </div>
                {errors.captcha && <p className="-mt-2 text-xs text-red-500">{errors.captcha}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded bg-[#1b234f] px-6 py-2 text-white shadow hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    'SUBMIT'
                  )}
                </button>
              </form>

              <div className="flex flex-col items-center justify-start">
                <div className="h-96 w-full">
                  <img
                    src="/contact.png"
                    alt="Card image"
                    className="h-full w-full rounded object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={openApplyNow}
                  disabled={isSubmitting}
                  className="mt-6 rounded bg-[#a12a2a] px-6 py-2 text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          <section className="mt-10 bg-[#1b234f] py-10 text-white">
            <div className="mx-auto max-w-6xl px-4 text-center">
              <div className="mb-4 flex justify-center text-3xl">
                <PhoneCall aria-hidden="true" />
              </div>
              <p className="text-lg font-semibold">
                <a href="tel:+919655777000" className="transition hover:text-red-400">
                  +91 96557 77000
                </a>
              </p>
              <p className="mb-6 text-lg font-semibold">
                <a href="tel:+919787570746" className="transition hover:text-red-400">
                  +91 97875 70746
                </a>
              </p>
              <p className="text-sm">
                <span className="font-bold">Address</span> Sholavandhan Road, Melakkal Road kochadai,
                Madurai, Tamil Nadu, 625019
              </p>
              <p className="mt-2 text-sm">
                <span className="font-bold">Email</span>{' '}
                <a href="mailto:contact@queenmira.com" className="transition hover:text-red-400">
                  contact@queenmira.com
                </a>
              </p>
            </div>
          </section>

          <div className="mt-10 w-full">
            <iframe
              title="School Location Map"
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d3385.7174162986807!2d78.06721842708833!3d9.94930638278185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3b00cf295cdadddd%3A0x9ea7866071b1aa99!2sW3X8%2BJM7%20Queen%20Mira%20International%20School%20(CBSE%20with%20CIS%20Accredtion)%2C%20Madurai%20Sholavandhan%20Road%2C%20Melakkal%20Rd%2C%20Kochadai%2C%20Madurai%2C%20Tamil%20Nadu%20625019%2C%20India!3m2!1d9.949084!2d78.0696864!5e0!3m2!1sen!2sus!4v1765033188818!5m2!1sen!2sus"
              className="h-[400px] w-full md:h-[500px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <CareerSiteFooter />
      <Toaster position="top-right" />
    </>
  );
}
