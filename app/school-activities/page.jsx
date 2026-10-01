'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CareerSiteFooter,
  CareerSiteHeader,
  PageHeader,
} from '@/components/CareerSiteChrome';

const activityImages = Array.from(
  { length: 6 },
  (_, index) => `/after-school-activities/${index + 10}.png`,
);

function ApplyButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
    >
      Apply Now &gt;
    </button>
  );
}

function EnquiryDialog({ open, onClose, enquiryFor }) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    activityType: enquiryFor || '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setFields({
      name: '',
      email: '',
      phone: '',
      activityType: enquiryFor || '',
      message: '',
    });
    setError('');
    setSuccess('');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, enquiryFor]);

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
      setSuccess('Enquiry submitted successfully!');
      window.setTimeout(onClose, 2000);
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-enquiry-title"
        className="relative max-h-full w-full max-w-md overflow-y-auto rounded-md bg-[#FAEECF] p-8 shadow-lg"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 text-xl font-bold text-gray-700 hover:text-black disabled:opacity-50"
        >
          ×
        </button>
        <h2 id="activity-enquiry-title" className="mb-6 text-center text-xl font-bold text-[#1b234f]">
          Enquire Now
        </h2>
        {error && <p role="alert" className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">{success}</p>}
        <form onSubmit={submitEnquiry} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
            required
            disabled={isSubmitting}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={fields.email}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
            required
            disabled={isSubmitting}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={fields.phone}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
            required
            disabled={isSubmitting}
          />
          <select
            name="activityType"
            value={fields.activityType}
            onChange={updateField}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 outline-none"
            required
            disabled={isSubmitting}
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
            className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[#1b234f] py-2 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'ENQUIRE NOW'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ActivitiesCarousel({ images }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-14" aria-label="Activity photo gallery">
      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
      >
        {images.map((src, index) => (
          <div key={src} className="relative h-64 min-w-[82%] snap-center overflow-hidden rounded-md sm:min-w-[46%] lg:min-w-[31%]">
            <Image
              src={src}
              alt={`Activity Image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 31vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous activity photos"
        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1b234f] shadow"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next activity photos"
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1b234f] shadow"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
}

export default function SchoolActivitiesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [enquiryFor, setEnquiryFor] = useState(undefined);

  const handleApplyNow = (type) => {
    setEnquiryFor(type);
    setOpenDialog(true);
  };

  return (
    <>
      <CareerSiteHeader />
      <PageHeader contentTitle="After School Activities" />
      <main className="min-h-screen text-[#1b234f]">
        <style jsx global>{`
          .bg-grid-dots {
            background-color: #f9fafb;
            background-image: radial-gradient(#d7d9df 0.8px, transparent 0.8px);
            background-size: 18px 18px;
          }
        `}</style>
        <div className="bg-grid-dots">
          <div className="flex justify-center p-4">
            <Image
              src="/after-school-activities/main.jpg"
              width={1000}
              height={1000}
              alt="After school activities at QMIS"
              className="h-auto max-w-full"
              priority
            />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <article className="overflow-hidden border border-gray-200 bg-[#1b234f]">
                <div className="flex justify-center bg-[#1b234f] p-6">
                  <Image
                    src="/after-school-activities/1.webp"
                    width={600}
                    height={500}
                    alt="Pullela Gopichand"
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#a12a2a] p-8 text-center text-white">
                  <h2 className="text-xl font-bold">
                    QMBA in collaboration with Celebrate Sports Foundation mentored by Pullela Gopichand
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed">
                    Unlocking Potentials with World-class<br />Training &amp; Guidance!
                  </p>
                  <ApplyButton onClick={() => handleApplyNow('badminton')} />
                </div>
              </article>
              <article className="overflow-hidden border border-gray-200 bg-[#1b234f]">
                <div className="flex justify-center bg-[#a12a2a] p-6">
                  <Image
                    src="/after-school-activities/2.webp"
                    width={600}
                    height={500}
                    alt="After School Activities"
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#1b234f] p-8 text-center text-white">
                  <h2 className="text-xl font-bold">After School Activities</h2>
                  <p className="mt-4 text-sm leading-relaxed">
                    Empowering Future Scholars, Athletic Icons and Rising Intellects through After-school Activities!
                  </p>
                  <ApplyButton onClick={() => handleApplyNow('school-activities')} />
                </div>
              </article>
              <article className="overflow-hidden border border-gray-200 bg-[#a12a2a]">
                <div className="flex justify-center bg-[#1b234f] p-6">
                  <Image
                    src="/after-school-activities/3.webp"
                    width={600}
                    height={500}
                    alt="Kidz Gym"
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#a12a2a] p-8 text-center text-white">
                  <h2 className="text-xl font-bold">Kidz Gym</h2>
                  <p className="mt-4 text-sm leading-relaxed">
                    From Screen time to Dumbbells: Enhancing Physical &amp; Mental Well-being from a Tender Age!
                  </p>
                  <ApplyButton onClick={() => handleApplyNow('kidz-gym')} />
                </div>
              </article>
            </div>
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-[#1b234f]">
                STARTING AT <span className="pl-3 text-3xl text-[#a12a2a]">Rs.3000</span>
              </p>
            </div>
          </div>
        </div>

        <section className="bg-[#1b234f]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 p-10 md:grid-cols-2">
            <div className="flex justify-center">
              <div>
                <Image
                  src="/after-school-activities/17.webp"
                  width={520}
                  height={680}
                  alt="Badminton Academy"
                  className="transform object-contain -rotate-[7deg]"
                />
                <h2 className="mt-3 text-center text-3xl font-extrabold tracking-wide text-white">
                  BADMINTON ACADEMY
                </h2>
              </div>
            </div>
            <div className="space-y-6 text-white">
              <h3 className="text-2xl font-bold leading-snug">
                Queen Mira’s Badminton Academy in collaboration with Celebrate Sports Foundation mentored by Pullela Gopichand
              </h3>
              <p className="font-semibold">Unlocking Potentials with World-class Training &amp; Guidance!</p>
              <p className="text-md leading-loose text-gray-200">
                This yet another exclusive feature of Queen Mira aims to foster a love for badminton among students and sports enthusiasts of all ages. QMIS is going to open a state-of-the-art badminton court in collaboration with ‘Celebrate Sports Foundation’s – Badminton Academy’ mentored by Pullela Gopichand, the renowned trainer of Olympic medalists P.V. Sindhu, Saina Nehwal, and other top International Players.
              </p>
              <ApplyButton onClick={() => handleApplyNow('badminton')} />
            </div>
          </div>
        </section>

        <section className="bg-grid-dots">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 p-10 md:grid-cols-2">
            <div className="order-2 space-y-6 md:order-1">
              <h2 className="text-3xl font-extrabold tracking-wide text-[#1b234f]">Kidz Gym</h2>
              <p className="font-semibold leading-snug text-[#a12a2a]">
                From Screentime to Dumbbells: Enhancing<br />
                Physical &amp; Mental Well-being from a Tender Age!
              </p>
              <p className="text-md leading-loose text-gray-600">
                To address screen time and combat obesity from a young age, QMIS has proposed launching a kids&apos; gym for children aged 6 months to 12 years, emphasizing strength, flexibility, and agility during early development.
              </p>
              <ApplyButton onClick={() => handleApplyNow('kidz-gym')} />
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <div>
                <Image
                  src="/after-school-activities/Pic 6.png"
                  width={520}
                  height={680}
                  alt="Kidz Gym"
                  className="object-cover"
                />
                <h2 className="mt-2 text-center text-3xl font-extrabold tracking-wide text-red-700">
                  KIDZ GYM
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FAEECF] pt-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-3">
            <div className="order-2 space-y-6 md:order-1">
              <h2 className="text-2xl font-extrabold leading-snug text-[#1b234f]">
                WISH TO ENROL FOR THE<br />AFTER SCHOOL ACTIVITIES
              </h2>
              <div className="space-y-5 text-sm text-gray-800 md:text-base">
                <p className="flex gap-3">
                  <span className="text-xl font-bold text-[#1b234f]">›</span>
                  <span>
                    Open to all children OF 4 years and above<br />
                    <span className="text-gray-500">
                      (Contact the Program Coordinator for more details regarding the age eligibility for the various activities)
                    </span>
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-xl font-bold text-gray-500">›</span>
                  <span>Currently available to Queen Mira&apos;s students.<br />Will be open to the public from 15th October 2024</span>
                </p>
                <p className="flex gap-3">
                  <span className="text-xl font-bold text-gray-500">›</span>
                  <span>Open on Monday - Friday<br />Timing 3.30 PM - 5.30 PM</span>
                </p>
                <p className="flex gap-3">
                  <span className="text-xl font-bold text-gray-500">›</span>
                  <span>Special offer on after-school activities<br />starting at Rs. 3000</span>
                </p>
              </div>
            </div>
            <div className="relative order-1 flex justify-center md:order-2">
              <div className="absolute top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#e4d9b9] md:h-96 md:w-96" />
              <Image
                src="/after-school-activities/19.webp"
                width={420}
                height={600}
                alt="Shooter Girl"
                className="relative z-10 object-contain"
              />
            </div>
            <div className="order-3 space-y-6">
              <h2 className="text-2xl font-extrabold leading-snug text-[#1b234f]">
                WHY CHOOSE THE AFTER-SCHOOL<br />ACTIVITIES AT QMIS?
              </h2>
              <div className="space-y-5 text-sm leading-relaxed text-gray-800 md:text-base">
                <p>Expert training &amp; coaching for the chosen field of interest.</p>
                <p>A tailored learning environment for each activity, to set the right tone and for effective learning.</p>
                <p>CCTV monitoring &amp; security system to ensure the safety of students at all times.</p>
                <p>
                  Thorough training &amp; opportunities to participate in varied competitions, Grading exams (for musical instruments), and Belt exams (for Martial Arts).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 p-10 md:grid-cols-2">
            <div className="flex justify-center">
              <Image
                src="/after-school-activities/18.webp"
                width={520}
                height={680}
                alt="After School Activities Shooting Practice"
                className="transform object-cover -rotate-[7deg]"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-[#1b234f]">After school activities</h2>
              <p className="font-semibold leading-snug text-[#a12a2a]">
                Empowering Future Scholars, Athletic Icons, and<br />
                Rising Intellects through After-school Activities!
              </p>
              <p className="text-md leading-loose text-gray-600">
                At QMIS, kindergarteners and students are encouraged to explore beyond Rhymes, Science, and classrooms through extra-curricular activities and sports like Skating, Rifle Shooting, Keyboard, Bharathanatyam, Music, Karate, Taekwondo, Yoga, Silambam, Swimming, Basketball, Western Dance, and more. These programs are crafted to keep the body and mind of the students in balance, ensuring stable and robust growth from the germinating stage.
              </p>
              <ApplyButton onClick={() => handleApplyNow('school-activities')} />
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
            <div className="px-6 md:border-r md:border-gray-300">
              <h2 className="text-2xl font-bold text-[#1b234f]">Sports</h2>
              <ul className="mt-4 space-y-2 text-gray-700">
                {['Rifle & Pistol Training', 'Skating', 'Basketball', 'Football', 'Throwball', 'Athletics', 'Tennis', 'Table Tennis'].map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-8 px-6 md:border-r md:border-gray-300">
              <div>
                <h2 className="text-2xl font-bold text-[#1b234f]">Performance Arts</h2>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {['Classical Dance', 'Western Dance', 'Carnatic Music', 'Instruments - Guitar, Keyboard, Drums'].map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1b234f]">Martial Arts</h2>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {['Silambam', 'Karate', 'Kung Fu', 'Taekwondo'].map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-8 px-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1b234f]">Well-being</h2>
                <ul className="mt-4 space-y-2 text-gray-700"><li>Yoga</li></ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1b234f]">Exploring Technology</h2>
                <ul className="mt-4 space-y-2 text-gray-700"><li>Robotics</li></ul>
              </div>
            </div>
          </div>
        </section>

        <ActivitiesCarousel images={activityImages} />
      </main>
      <CareerSiteFooter />
      <EnquiryDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        enquiryFor={enquiryFor}
      />
    </>
  );
}
