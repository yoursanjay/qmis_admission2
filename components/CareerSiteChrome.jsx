'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Menu,
  MessageCircle,
  X,
  Youtube,
} from 'lucide-react';

export function PageHeader({ contentTitle }) {
  return (
    <section className="bg-navy px-5 py-12 text-center text-white sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{contentTitle}</h1>
    </section>
  );
}

export function CareerSiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  return (
    <>
      <div className="h-2 bg-[#68449a]" />
      <header className="sticky top-0 z-40 border-r-4 border-[#ED0016] bg-[#dceeff]">
        <div className="mx-auto flex h-[82px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-[#070D43]" aria-label="Queen Mira International School home">
            <Image
              src="https://qmis-website.vercel.app/QMIS_Logo.webp"
              alt="Queen Mira International School"
              width={88}
              height={44}
              unoptimized
              className="h-11 w-auto shrink-0"
            />
          </Link>
          <nav className="flex items-center gap-4 text-[13px] font-semibold text-[#070D43] sm:gap-8">
            <a href="https://qmis.edu.in/" className="whitespace-nowrap">
              Main Website
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="career-side-menu"
            >
              {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <a
              href="/redirect?url=%2Fclient%2Fenquiry-form"
              className="whitespace-nowrap rounded bg-[#ED0016] px-4 py-3 font-bold text-white"
            >
              Apply Now
            </a>
          </nav>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[90px] z-50">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-[#070D43]/35"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          />
          <nav
            id="career-side-menu"
            aria-label="Additional navigation"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col gap-1 bg-white px-6 py-8 text-[#070D43] shadow-xl"
          >
            {[
              ['Career @QMIS', '/career'],
              ['School Activities', '/school-activities'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded px-3 py-3 text-sm font-semibold transition-colors hover:bg-[#DCEEFF] hover:text-[#ED0016]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

export function CareerSiteFooter() {
  return (
    <footer className="relative border-r-4 border-[#ED0016] bg-[#080c3e] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_1fr_1.4fr] lg:gap-16 lg:py-9">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[82px] w-[62px] shrink-0 overflow-hidden" aria-hidden="true">
              <Image
                src="https://qmis-website.vercel.app/QMIS_Logo.webp"
                alt=""
                width={164}
                height={82}
                unoptimized
                className="h-[82px] w-[164px] max-w-none"
              />
            </span>
            <span className="max-w-28 text-sm font-semibold leading-4 text-white">
              queen mira<br />international school
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">Queen Mira International School</p>
          <p className="mt-3 max-w-sm text-sm leading-6">
            Sholavandhan Road, Melakkal Rd, Kochadai,<br />
            Madurai, Tamil Nadu 625019
          </p>
          <a className="mt-3 inline-block text-sm hover:underline" href="mailto:contact@queenmira.com">
            contact@queenmira.com
          </a>
          <a className="mt-6 block text-sm font-semibold underline" href="#">
            Privacy Policy
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#ff1738]">Policies</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              'Privacy Policy',
              'Terms and Conditions',
              'Shipping Delivery',
              'Cancellation and Refund',
            ].map((policy) => (
              <li key={policy}>
                <a href="#" className="hover:underline">{policy}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#ff1738]">Connect</h2>
          <div className="mt-4 flex gap-5">
            {[
              { label: 'Facebook', Icon: Facebook, href: 'https://www.facebook.com/' },
              { label: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/' },
              { label: 'YouTube', Icon: Youtube, href: 'https://www.youtube.com/' },
            ].map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b245d] hover:bg-[#293576]"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
          <h2 className="mt-7 text-lg font-semibold text-[#ff1738]">Contact</h2>
          <div className="mt-3 space-y-2 text-sm">
            <a className="block hover:underline" href="tel:+919655777000">+91 96557 77000</a>
            <a className="block hover:underline" href="tel:+919677715429">+91 96777 15429</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm">
        © {new Date().getFullYear()} Queen Mira International School. All rights reserved.
      </div>
      <a
        href="https://wa.me/919655777000"
        aria-label="Contact Queen Mira International School on WhatsApp"
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#20d366] text-white shadow-lg"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5de16b]">
          <MessageCircle size={19} />
        </span>
      </a>
    </footer>
  );
}
