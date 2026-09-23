'use client';

import { useState } from 'react';

const APPLY_URL = '/redirect?url=%2Fclient%2Fenquiry-form';
const ageGroups = [
  ['Play Home', '2-3 Years'],
  ['Pre-KG', '3+ Years'],
  ['KG 1', '4+ Years'],
  ['KG 2', '5+ Years'],
];
const statistics = [
  ['350+', 'Successful Alumni'],
  ['100+', 'Global Universities'],
  ['100+', 'Sports Stars'],
  ['20+', 'Innovative Practices'],
  ['14+', 'Year Legacy'],
];

function ApplyNow({ children = 'Apply Now', className = '' }) {
  return <a href={APPLY_URL} className={className}>{children}</a>;
}

export default function AdmissionsLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf3] text-[#17244f]">
      <header className="sticky top-0 z-40 border-b border-[#e9dfcf] bg-[#fffaf3]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="https://qmis-website.vercel.app/QMIS_Logo.webp" alt="Queen Mira International School" className="h-12 w-auto" />
            <span className="hidden text-[11px] font-bold uppercase leading-tight sm:block">queen mira<br />international school</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a href="#admissions">Admissions</a><a href="#journey">Our Journey</a><a href="#accreditation">Why QMIS</a><a href="#contact">Contact</a>
            <ApplyNow className="rounded-full bg-[#c41230] px-6 py-3 text-white">Apply Now</ApplyNow>
          </nav>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-md border border-[#17244f] px-3 py-2 text-sm lg:hidden" aria-expanded={menuOpen}>{menuOpen ? 'Close' : 'Menu'}</button>
        </div>
        {menuOpen && <nav className="mx-auto flex max-w-7xl flex-col gap-4 pb-3 pt-4 text-sm font-semibold lg:hidden"><a href="#admissions">Admissions</a><a href="#journey">Our Journey</a><a href="#accreditation">Why QMIS</a><a href="#contact">Contact</a><ApplyNow className="w-fit rounded-full bg-[#c41230] px-6 py-3 text-white">Apply Now</ApplyNow></nav>}
      </header>

      <section id="admissions" className="bg-[#f5e9d7] px-5 py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.25em] text-[#c41230]">Admissions open 2026</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[.98] md:text-7xl">Tomorrow&apos;s leaders take their first steps here.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#4b4e5a] md:text-lg">Admissions open for Play Home, Pre-KG &amp; KG. Begin your child&apos;s journey at QMIS with holistic learning and global values.</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#c41230]">1:10 Student-Teacher ratio | All-Rounded Growth | Kidz Gym | Montessori Techniques | Beyond Books Learning | Happy Schooling</p>
            <ApplyNow className="mt-8 inline-flex rounded-full bg-[#c41230] px-8 py-4 font-bold text-white">Apply before Oct 20, 2026</ApplyNow>
            <div className="mt-10 rounded-2xl border border-[#dbc9af] bg-white/50 p-5">
              <p className="text-sm font-bold uppercase tracking-widest text-[#c41230]">Vijayadasami 2026 admissions now open for</p>
              <p className="mt-2 text-lg font-bold">Play Home | Pre-KG | KG 1 | KG 2</p>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#c41230]">Age limit</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{ageGroups.map(([name, age]) => <div key={name} className="rounded-xl bg-[#17244f] p-3 text-white"><p className="text-xs font-semibold">{name}</p><p className="mt-1 text-sm font-bold">{age}</p></div>)}</div>
            </div>
          </div>
          <div className="flex justify-center"><img src="https://qmis-website.vercel.app/hero-child.webp" alt="Child climbing ladder" className="max-h-[560px] w-full max-w-[520px] object-contain" /></div>
        </div>
      </section>

      <div className="overflow-hidden bg-[#c41230] py-3 text-sm font-black uppercase tracking-[.18em] text-white"><div className="animate-scroll flex w-max gap-10">{[...Array(8)].map((_, index) => <span key={index}>VIJAYADASAMI – 2026 ADMISSIONS OPEN ✦</span>)}</div></div>

      <section id="journey" className="px-5 py-16 md:py-24"><div className="mx-auto max-w-6xl text-center"><p className="text-sm font-bold uppercase tracking-[.25em] text-[#c41230]">A confident beginning</p><h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">Let Your Child&apos;s First Words &amp; First Dreams Take Off at Queen Mira!</h2><div className="mt-14 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">{statistics.map(([value, label]) => <div key={label} className="rounded-2xl border border-[#eadcc8] bg-white p-6 shadow-sm"><p className="text-4xl font-black text-[#c41230]">{value}</p><p className="mt-2 text-sm font-semibold text-[#4b4e5a]">{label}</p></div>)}</div></div></section>

      <section id="accreditation" className="grid gap-10 bg-[#17244f] px-5 py-16 text-white md:py-24 lg:grid-cols-2 lg:items-center"><div className="mx-auto w-full max-w-2xl"><div className="aspect-video overflow-hidden rounded-2xl bg-black"><iframe className="h-full w-full" src="https://www.youtube.com/embed/5cbMffL8PLw" title="Admissions video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></div><div className="mx-auto max-w-xl"><p className="text-sm font-bold uppercase tracking-[.25em] text-[#f5c9b3]">Global standards, local warmth</p><h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Join the World&apos;s first ever CBSE school with CIS accreditation</h2><p className="mt-6 text-lg leading-8 text-white/75">QMIS is your child&apos;s second home, a safe, caring space where global standards meet the warmth every parent looks for.</p><ApplyNow className="mt-8 inline-flex rounded-full bg-white px-7 py-3 font-bold text-[#c41230]">Apply Now</ApplyNow></div></section>

      <section className="bg-[#f5e9d7] px-5 py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl bg-[#f7c6ad] p-8 md:grid-cols-2 md:p-14"><div><p className="text-sm font-bold uppercase tracking-[.25em] text-[#c41230]">Revealed!</p><h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Secrets To Free Your Child From Screens</h2><button type="button" className="mt-7 rounded-full bg-[#c41230] px-7 py-3 font-bold text-white">Download for Free</button></div><img src="https://qmis-website.vercel.app/girl_1.webp" alt="Child using tablet" className="mx-auto max-h-72 object-contain" /></div></section>

      <a href="https://api.whatsapp.com/send/?phone=919677715429&text=Hello" target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-30 rounded-full bg-[#25d366] p-4 shadow-xl" aria-label="WhatsApp"><img src="https://qmis-website.vercel.app/Whatsapp_Icon.png" alt="" className="h-7 w-7" /></a>
      <footer id="contact" className="bg-[#101a3b] px-5 py-14 text-white"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4"><div><img src="https://qmis-website.vercel.app/QMIS_White_Logo.png" alt="Queen Mira International School" className="h-12 w-auto" /><p className="mt-5 text-sm leading-6 text-white/70">Queen Mira International School</p><p className="mt-3 text-sm leading-6 text-white/70">Sholavandhan Road, Melakkal Rd, Kochadai,<br />Madurai, Tamil Nadu 625019</p><a href="mailto:contact@queenmira.com" className="mt-3 block text-sm text-white/80">contact@queenmira.com</a></div><div><h3 className="font-bold">Policies</h3><div className="mt-4 grid gap-3 text-sm text-white/70"><a href="/privacy-policy">Privacy Policy</a><a href="/terms-and-conditions">Terms and Conditions</a><a href="/shipping-delivery">Shipping Delivery</a><a href="/cancellation-and-refund">Cancellation and Refund</a></div></div><div><h3 className="font-bold">Connect</h3><div className="mt-4 flex gap-4 text-sm text-white/70"><a href="https://www.facebook.com/qmiscis">Facebook</a><a href="https://www.instagram.com/qmiscis/">Instagram</a><a href="https://www.youtube.com/c/QueenMiraInternationalSchool">YouTube</a></div></div><div><h3 className="font-bold">Contact</h3><a href="tel:+919655777000" className="mt-4 block text-white/70">+91 96557 77000</a><a href="tel:+919677715429" className="mt-2 block text-white/70">+91 96777 15429</a></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6 text-xs text-white/50">© 2026 Queen Mira International School. All rights reserved.</div></footer>
    </main>
  );
}
