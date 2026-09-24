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
    <main
      className="min-h-screen overflow-hidden bg-[#fffaf3] text-[#17244f]"
      style={{
        '--primary-navy': '#202B63',
        '--primary-red': '#ED0016',
        '--header-blue': '#DCEEFF',
        '--section-blue': '#EAF4FC',
        '--white': '#FFFFFF',
        '--section-text': '#102A72',
      }}
    >
      <style jsx>{`
        @keyframes floatCloud {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.82; }
          50% { transform: translate3d(12px, -10px, 0); opacity: 1; }
        }
        .cloud {
          position: absolute;
          height: 34px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.74);
          box-shadow: 18px 8px 0 -8px rgba(255,255,255,0.72), 36px 7px 0 -10px rgba(255,255,255,0.72), 52px 12px 0 -16px rgba(255,255,255,0.7);
          filter: blur(0.5px);
        }
        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: rgba(255,255,255,0.74);
          border-radius: 50%;
        }
        .cloud::before {
          width: 28px;
          height: 28px;
          left: 14px;
          top: -12px;
        }
        .cloud::after {
          width: 34px;
          height: 34px;
          right: 14px;
          top: -16px;
        }
      `}</style>

      <header className="sticky top-0 z-40 bg-[var(--header-blue)]">
        <div className="mx-auto flex h-[82px] max-w-[1120px] items-center justify-between px-5 md:px-6">
          <a href="/" className="flex items-center gap-2.5 leading-none">
            <img src="https://qmis-website.vercel.app/QMIS_Logo.webp" alt="Queen Mira International School" className="h-10 w-auto shrink-0 sm:h-11" />
            <span className="text-[8.5px] font-bold uppercase leading-[0.96] tracking-[0.04em] text-[#070D43] sm:text-[9.5px]">queen<br />mira<br />international school</span>
          </a>
          <nav className="flex items-center gap-5 text-[13px] font-semibold text-[#070D43] sm:gap-7">
            <a href="https://qmis.edu.in/" className="whitespace-nowrap">Main Website</a>
            <ApplyNow className="inline-flex items-center justify-center whitespace-nowrap rounded-[4px] bg-[var(--primary-red)] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[var(--primary-red)]">Apply Now</ApplyNow>
          </nav>
        </div>
      </header>

      <section id="admissions" className="bg-[var(--primary-navy)] px-5 pb-5 pt-8 text-[var(--white)] md:pb-6 md:pt-10">
        <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="lg:pl-8 xl:pl-10">
            <h1 className="max-w-[520px] text-[50px] font-bold leading-[0.98] tracking-[-0.05em] text-white md:text-[56px]">Tomorrow&apos;s<br />leaders take their<br />first steps here.</h1>
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.5] text-white/85 md:text-[16px]">Admissions open for Play Home, Pre-KG &amp; KG. Begin your child&apos;s journey at QMIS with holistic learning and global values.</p>
            <p className="mt-2 max-w-[620px] text-[15px] font-semibold leading-[1.5] text-white md:text-[16px]">1:10 Student-Teacher ratio | All-Rounded Growth | Kidz Gym | Montessori Techniques | Beyond Books Learning | Happy Schooling</p>
            <ApplyNow className="mt-7 inline-flex rounded-[4px] bg-[var(--primary-red)] px-5 py-3 text-[18px] font-bold text-white shadow-md">Apply before Oct 20, 2026</ApplyNow>

            <div className="mt-7 max-w-[520px]">
              <p className="text-[16px] leading-6 text-white/80">Vijayadasami 2026 Admissions now open for</p>
              <p className="mt-2 text-[16px] font-bold">Play Home | Pre-KG | KG 1 | KG 2</p>
              <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.08em] text-white">Age Limit</p>
              <div className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-4 sm:gap-y-0">
                {ageGroups.map(([name, age], index) => (
                  <div key={name} className={`min-h-[60px] px-3 text-left sm:first:pl-0 sm:last:pr-0 ${index > 0 ? 'border-white/35 sm:border-l' : ''}`}>
                    <p className="text-[14px] font-semibold text-white">{name}</p>
                    <p className="mt-1 text-[14px] text-white/75">{age}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-center lg:justify-end">
            <div className="cloud" style={{ left: '8%', top: '10%', width: '110px', animation: 'floatCloud 9s ease-in-out infinite' }} />
            <div className="cloud" style={{ right: '8%', top: '14%', width: '90px', transform: 'scale(0.9)', animation: 'floatCloud 11s ease-in-out infinite' }} />
            <div className="cloud" style={{ left: '18%', bottom: '18%', width: '92px', transform: 'scale(0.8)', animation: 'floatCloud 10s ease-in-out infinite' }} />
            <img src="https://qmis-website.vercel.app/hero-child.webp" alt="Child climbing ladder" className="max-h-[570px] w-full max-w-[440px] object-contain object-bottom drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]" />
          </div>
        </div>
      </section>

      <div className="w-full overflow-hidden bg-[var(--primary-red)] py-3 text-sm font-black uppercase tracking-[.18em] text-white">
        <div className="animate-scroll flex w-max gap-10">
          {[...Array(8)].map((_, index) => (
            <span key={index}>VIJAYADASAMI – 2026 ADMISSIONS OPEN ✦</span>
          ))}
        </div>
      </div>

      <section id="journey" className="bg-[var(--section-blue)] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="sr-only text-xs font-bold uppercase tracking-[.25em] text-[#ed0016]">A confident beginning</p>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-[var(--section-text)] md:text-4xl">
            Let Your Child&apos;s First Words &amp; First<br className="hidden md:block" /> Dreams Take Off at Queen Mira!
          </h2>
          <div className="mx-auto mt-14 grid max-w-[1104px] grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-6">
            {statistics.map(([value, label], index) => (
              <div key={label} className={`flex min-h-[174px] flex-col items-center justify-center rounded-xl border border-[#78aaff] bg-[#c8ddff] p-6 ${index < 3 ? 'sm:col-span-2' : index === 3 ? 'sm:col-span-3 sm:col-start-1' : 'sm:col-span-3 sm:col-start-4'}`}>
                <p className="text-3xl font-black text-[var(--section-text)]">{value}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--section-text)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="accreditation" className="bg-white px-5 py-16 text-[#17244f] md:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[592px_1fr] lg:items-center lg:gap-12">
          <div className="w-full">
            <div className="aspect-video overflow-hidden rounded-[10px] bg-black shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
              <iframe className="h-full w-full" src="https://www.youtube.com/embed/5cbMffL8PLw" title="Admissions video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
          <div className="max-w-[520px]">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#ed0016]">Global standards, local warmth</p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Join the World&apos;s first ever CBSE school with CIS accreditation</h2>
            <p className="mt-5 text-[16px] leading-7 text-[#4b4e5a]">QMIS is your child&apos;s second home, a safe, caring space where global standards meet the warmth every parent looks for.</p>
            <ApplyNow className="mt-6 inline-flex rounded-md bg-[var(--primary-red)] px-6 py-2.5 text-sm font-bold text-white">Apply Now</ApplyNow>
          </div>
        </div>
      </section>

      <a href="https://api.whatsapp.com/send/?phone=919677715429&text=Hello" target="_blank" rel="noreferrer" className="fixed bottom-4 right-5 z-30 rounded-full bg-[#25d366] p-3 shadow-lg sm:bottom-5 sm:right-6" aria-label="WhatsApp"><img src="https://qmis-website.vercel.app/Whatsapp_Icon.png" alt="" className="h-7 w-7" /></a>
      <footer id="contact" className="bg-[#080D43] px-5 py-10 text-white sm:px-8 sm:py-10"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-3"><div><img src="https://qmis-website.vercel.app/QMIS_White_Logo.png" alt="Queen Mira International School" className="h-20 w-auto" /><p className="mt-5 text-[15px] font-semibold text-white">Queen Mira International School</p><p className="mt-3 text-sm leading-6 text-[#E5E7EB]">Sholavandhan Road, Melakkal Rd, Kochadai,<br />Madurai, Tamil Nadu 625019</p><a href="mailto:contact@queenmira.com" className="mt-3 block text-sm text-[#E5E7EB]">contact@queenmira.com</a><a href="/privacy-policy" className="mt-6 block text-sm text-white underline">Privacy Policy</a></div><div><h3 className="text-lg font-semibold text-[#FF1B2D]">Policies</h3><div className="mt-4 grid gap-3 text-sm text-[#E5E7EB]"><a href="/privacy-policy">Privacy Policy</a><a href="/terms-and-conditions">Terms and Conditions</a><a href="/shipping-delivery">Shipping Delivery</a><a href="/cancellation-and-refund">Cancellation and Refund</a></div></div><div><h3 className="text-lg font-semibold text-[#FF1B2D]">Connect</h3><div className="mt-4 flex gap-5"><a href="https://www.facebook.com/qmiscis" aria-label="Facebook" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Facebook size={19} /></a><a href="https://www.instagram.com/qmiscis/" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Instagram size={19} /></a><a href="https://www.youtube.com/c/QueenMiraInternationalSchool" aria-label="YouTube" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b255c] text-white"><Youtube size={19} /></a></div><h3 className="mt-6 text-lg font-semibold text-[#FF1B2D]">Contact</h3><a href="tel:+919655777000" className="mt-4 block text-sm text-[#E5E7EB]">+91 96557 77000</a><a href="tel:+919677715429" className="mt-2 block text-sm text-[#E5E7EB]">+91 96777 15429</a></div></div><div className="mt-8 border-t border-white/10 pt-5 text-center text-sm text-[#E5E7EB]">© 2026 Queen Mira International School. All rights reserved.</div></footer>
    </main>
  );
}
