'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SchoolActivitiesPage() {
  const router = useRouter();
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    activityType: 'school-activities',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/after-school-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit enquiry');
      if (fields.activityType === 'badminton') {
        router.push('/school-activities/badminton');
        return;
      }
      if (fields.activityType === 'kidz-gym') {
        router.push('/school-activities/kids-gym');
        return;
      }
      setSuccess('Enquiry submitted successfully!');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-10 text-[#1b234f] sm:px-6">
      <section className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
          School Activities Enquiry
        </h1>
        <p className="mb-7 text-center text-sm text-gray-600">
          Complete the form below to submit your enquiry.
        </p>
        {error && (
          <p role="alert" className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">
            {success}
          </p>
        )}
        <form onSubmit={submitEnquiry} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#1b234f] focus:ring-2 focus:ring-[#1b234f]/15"
            required
            disabled={isSubmitting}
            aria-label="Name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={fields.email}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#1b234f] focus:ring-2 focus:ring-[#1b234f]/15"
            required
            disabled={isSubmitting}
            aria-label="Email"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={fields.phone}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#1b234f] focus:ring-2 focus:ring-[#1b234f]/15"
            required
            disabled={isSubmitting}
            aria-label="Mobile Number"
          />
          <select
            name="activityType"
            value={fields.activityType}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#1b234f] focus:ring-2 focus:ring-[#1b234f]/15"
            required
            disabled={isSubmitting}
            aria-label="Enquiry For"
          >
            <option value="" disabled>Enquiry For</option>
            <option value="badminton">Badminton</option>
            <option value="kidz-gym">Kidz Gym</option>
            <option value="school-activities">School Activities</option>
          </select>
          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            value={fields.message}
            onChange={updateField}
            className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#1b234f] focus:ring-2 focus:ring-[#1b234f]/15 sm:col-span-2"
            disabled={isSubmitting}
            aria-label="Message"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[#1b234f] py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'ENQUIRE NOW'}
          </button>
        </form>
      </section>
    </main>
  );
}
