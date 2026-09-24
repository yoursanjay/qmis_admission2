'use client';

import { useEffect, useState } from 'react';

const APPROVED_PATH = '/client/enquiry-form';
const DESTINATION = 'https://qmis-admission2.vercel.app/';

export default function RedirectPage() {
  const [seconds, setSeconds] = useState(3);
  useEffect(() => {
    const requestedPath = new URLSearchParams(window.location.search).get('url');
    const destination = requestedPath === APPROVED_PATH ? DESTINATION : DESTINATION;
    const countdownTimer = window.setInterval(() => setSeconds((value) => Math.max(1, value - 1)), 1000);
    const redirectTimer = window.setTimeout(() => {
      window.clearInterval(countdownTimer);
      document.cookie = 'qmis-return-to-home=1; Max-Age=10; Path=/; SameSite=Lax';
      window.location.assign(destination);
    }, 3000);
    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#fffaf3] text-[#17244f]">
      <header className="flex items-center justify-between border-b border-[#e9dfcf] px-5 py-4"><a href="/"><img src="https://qmis-website.vercel.app/QMIS_Logo.webp" alt="QMIS Logo" className="h-12 w-auto" /></a><a href="/admissions" className="rounded-full border border-[#17244f] px-5 py-2 text-sm font-bold">Admissions</a></header>
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center"><p className="text-sm font-bold uppercase tracking-[.25em] text-[#c41230]">Queen Mira International School</p><h1 className="mt-5 text-4xl font-black md:text-6xl">Taking you to admissions</h1><p className="mt-5 max-w-lg text-base leading-7 text-[#4b4e5a]">Please wait while we securely continue.</p><div className="mt-10 flex h-24 w-24 items-center justify-center rounded-full border-8 border-[#f5c9b3] text-4xl font-black text-[#c41230]" aria-live="polite">{seconds}</div><p className="mt-4 text-sm text-[#6b6b74]">Redirecting in {seconds} seconds...</p></section>
      <footer className="bg-[#101a3b] px-5 py-8 text-center text-xs text-white/60">© 2026 Queen Mira International School. All rights reserved.</footer>
    </main>
  );
}
