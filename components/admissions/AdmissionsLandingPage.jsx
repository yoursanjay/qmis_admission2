'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';

const APPLY_URL = '/redirect?url=%2Fclient%2Fenquiry-form';
const ageGroups = [
  ['Play Home', '2-3 Years'],
  ['Pre-KG', '3+ Years'],
  ['Kindergarten 1', '4+ Years'],
  ['Kindergarten 2', '5+ Years'],
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
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf3] text-[#17244f]">
      <header className="sticky top-0 z-40 h-[60px] bg-[#DCEEFF] px-4 sm:px-6">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <img src="https://qmis-website.vercel.app/QMIS_Logo.webp" alt="Queen Mira International School" className="h-11 w-auto shrink-0" />
            <span className="text-[10px] font-bold uppercase leading-[1.05] tracking-wide text-[#070D43] sm:text-[11px]">queen<br />mira<br />international school</span>
          </a>
          <nav className="flex items-center gap-3 text-[13px] font-semibold text-[#070D43] sm:gap-6 sm:text-sm">
            <a href="https://qmis.edu.in/" className="whitespace-nowrap">Main Website</a>
            <ApplyNow className="whitespace-nowrap rounded-[5px] bg-[#C00012] px-3 py-2 text-white sm:px-5">Apply Now</ApplyNow>
          </nav>
        </div>
      </header>

      <section id="admissions" className="bg-[#20295c] px-5 py-12 text-white md:min-h-[calc(100vh-60px)] md:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1fr_.95fr] lg:gap-16">
          <div className="lg:pl-2">
            <h1 className="max-w-xl text-5xl font-bold leading-[1.12] md:text-[44px]">Tomorrow&apos;s<br />leaders take their<br />first steps here.</h1>
            <p className="mt-6 max-w-xl text-sm leading-5 text-white/85">Admissions open for Play Home, Pre-KG &amp; KG. Begin your child&apos;s journey<br className="hidden md:block" /> at QMIS with holistic learning and global values.</p>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white">1:10 Student-Teacher ratio | All-Rounded Growth | Kidz Gym | Montessori<br className="hidden md:block" /> Techniques | Beyond Books Learning | Happy Schooling</p>
            <ApplyNow className="mt-6 inline-flex rounded-none bg-[#ed0016] px-5 py-3 text-sm font-bold text-white">Apply before Oct 20, 2026</ApplyNow>
            <div className="mt-14">
              <p className="text-sm text-white/75">Vijayadasami 2026 Admissions now open for</p>
              <p className="mt-2 text-sm font-bold">Play Home | Pre-KG | KG 1 | KG 2</p>
              <p className="mt-10 text-sm font-medium uppercase">Age limit</p>
              <div className="mt-4 grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-0">{ageGroups.map(([name, age], index) => <div key={name} className={`px-3 text-center sm:first:pl-0 sm:last:pr-0 ${index > 0 ? 'border-white/35 sm:border-l' : ''}`}><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-sm text-white/75">{age}</p></div>)}</div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><img src="https://qmis-website.vercel.app/hero-child.webp" alt="Child climbing ladder" className="max-h-[540px] w-full max-w-[500px] object-contain" /></div>
        </div>
      </section>

      <div className="overflow-hidden bg-[#c41230] py-3 text-sm font-black uppercase tracking-[.18em] text-white"><div className="animate-scroll flex w-max gap-10">{[...Array(8)].map((_, index) => <span key={index}>VIJAYADASAMI – 2026 ADMISSIONS OPEN ✦</span>)}</div></div>

      <section id="journey" className="bg-[#eef6ff] px-5 py-16 md:py-24"><div className="mx-auto max-w-5xl text-center"><p className="sr-only text-xs font-bold uppercase tracking-[.25em] text-[#ed0016]">A confident beginning</p><h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-[#071b55] md:text-4xl">Let Your Child&apos;s First Words &amp; First<br className="hidden md:block" /> Dreams Take Off at Queen Mira!</h2><div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-7 sm:grid-cols-6">{statistics.map(([value, label], index) => <div key={label} className={`flex min-h-[157px] flex-col items-center justify-center rounded-xl border border-[#78aaff] bg-[#c8ddff] p-6 sm:col-span-2 ${index === 3 ? 'sm:col-start-2' : index === 4 ? 'sm:col-start-4' : ''}`}><p className="text-3xl font-black text-[#071b55]">{value}</p><p className="mt-2 text-sm font-semibold text-[#071b55]">{label}</p></div>)}</div></div></section>

      <section id="accreditation" className="grid gap-8 bg-white px-5 py-10 text-[#17244f] md:py-14 lg:grid-cols-2 lg:items-center"><div className="mx-auto w-full max-w-2xl"><div className="aspect-video overflow-hidden rounded-md bg-black"><iframe className="h-full w-full" src="https://www.youtube.com/embed/5cbMffL8PLw" title="Admissions video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></div><div className="mx-auto max-w-xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#ed0016]">Global standards, local warmth</p><h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Join the World&apos;s first ever CBSE school with CIS accreditation</h2><p className="mt-4 text-sm leading-6 text-[#4b4e5a]">QMIS is your child&apos;s second home, a safe, caring space where global standards meet the warmth every parent looks for.</p><ApplyNow className="mt-6 inline-flex rounded-md bg-[#ed0016] px-6 py-2.5 text-sm font-bold text-white">Apply Now</ApplyNow></div></section>

      <a href="https://api.whatsapp.com/send/?phone=919677715429&text=Hello" target="_blank" rel="noreferrer" className="fixed bottom-4 right-5 z-30 rounded-full bg-[#25d366] p-3 shadow-lg sm:bottom-5 sm:right-6" aria-label="WhatsApp"><img src="https://qmis-website.vercel.app/Whatsapp_Icon.png" alt="" className="h-7 w-7" /></a>
      <footer id="contact" className="bg-[#080D43] px-5 py-10 text-white sm:px-8 sm:py-10"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-3"><div><img src="https://qmis-website.vercel.app/QMIS_White_Logo.png" alt="Queen Mira International School" className="h-20 w-auto" /><p className="mt-5 text-[15px] font-semibold text-white">Queen Mira International School</p><p className="mt-3 text-sm leading-6 text-[#E5E7EB]">Sholavandhan Road, Melakkal Rd, Kochadai,<br />Madurai, Tamil Nadu 625019</p><a href="mailto:contact@queenmira.com" className="mt-3 block text-sm text-[#E5E7EB]">contact@queenmira.com</a><a href="/privacy-policy" className="mt-6 block text-sm text-white underline">Privacy Policy</a></div><div><h3 className="text-lg font-semibold text-[#FF1B2D]">Policies</h3><div className="mt-4 grid gap-3 text-sm text-[#E5E7EB]"><a href="/privacy-policy">Privacy Policy</a><a href="/terms-and-conditions">Terms and Conditions</a><a href="/shipping-delivery">Shipping Delivery</a><a href="/cancellation-and-refund">Cancellation and Refund</a></div></div><div><h3 className="text-lg font-semibold text-[#FF1B2D]">Connect</h3><div className="mt-4 flex gap-5"><a href="https://www.facebook.com/qmiscis" aria-label="Facebook" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Facebook size={19} /></a><a href="https://www.instagram.com/qmiscis/" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Instagram size={19} /></a><a href="https://www.youtube.com/c/QueenMiraInternationalSchool" aria-label="YouTube" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Youtube size={19} /></a></div><h3 className="mt-6 text-lg font-semibold text-[#FF1B2D]">Contact</h3><a href="tel:+919655777000" className="mt-4 block text-sm text-[#E5E7EB]">+91 96557 77000</a><a href="tel:+919677715429" className="mt-2 block text-sm text-[#E5E7EB]">+91 96777 15429</a></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-5 text-xs text-white/50">© 2026 Queen Mira International School. All rights reserved.</div></footer>
    </main>
  );
}
