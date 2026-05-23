"use client";

import Link from "next/link";
import clsx from "clsx";

type FooterData = {
  brandName: string;
  brandDescription: string;
  ctaHeadline: string;
  ctaLabel: string;
  navLinks: Array<{ label: string; href: string }>;
  socialLinks: Array<{ label: string; short: string; url: string }>;
  copyright: string;
};

type Props = {
  footerData?: FooterData;
};

const DEFAULT_FOOTER_DATA: FooterData = {
  brandName: "KYLE",
  brandDescription: "Creative digital artist building bold custom visuals, identity work, web experiments, and commission-ready design.",
  ctaHeadline: "Let's make something unforgettable",
  ctaLabel: "Start a project",
  navLinks: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  socialLinks: [
    { label: "Instagram", short: "IG", url: "#" },
    { label: "LinkedIn", short: "LI", url: "#" },
    { label: "Bear Spirits Arts", short: "BA", url: "#" },
    { label: "GitHub", short: "GH", url: "#" },
  ],
  copyright: "Built with rebellion & Next.js",
};

export function Footer({ footerData }: Props) {
  const data = footerData || DEFAULT_FOOTER_DATA;
  
  // Split nav links into two columns
  const midPoint = Math.ceil(data.navLinks.length / 2);
  const linksCol1 = data.navLinks.slice(0, midPoint);
  const linksCol2 = data.navLinks.slice(midPoint);

  return (
    <footer className={clsx('bg-ink', 'relative', 'overflow-hidden', 'border-t', 'border-smoke')}>
      {/* Big CTA section */}
      <div className={clsx('border-b', 'border-smoke')}>
        <div className={clsx('container-punk', 'py-20', 'lg:py-28')}>
          <p className={clsx('section-eyebrow', 'mb-6')}>
            {data.ctaHeadline}
          </p>
          <h2 className={clsx('font-display', 'text-[clamp(4rem,12vw,14rem)]', 'leading-none', 'tracking-tightest', 'text-chalk', 'uppercase', 'block', 'mb-10')}>
            WORK WITH ME
          </h2>
          <Link href="/contact" className={clsx('btn-punk', 'text-base', 'px-10', 'py-5', 'inline-flex', 'items-center', 'gap-3')}>
            <span>{data.ctaLabel}</span>
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className={clsx('container-punk', 'py-16')}>
        <div className={clsx('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-10', 'mb-16')}>
          {/* Brand */}
          <div className={clsx('col-span-2', 'md:col-span-1')}>
            <p className={clsx('font-display', 'text-4xl', 'text-volt', 'tracking-widest', 'mb-4', 'uppercase')}>{data.brandName}</p>
            <p className={clsx('font-mono', 'text-ghost', 'text-sm', 'leading-relaxed', 'max-w-xs')}>
              {data.brandDescription}
            </p>
          </div>

          {/* Nav col 1 */}
          <div>
            <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-5')}>Navigate</p>
            <ul className={clsx('flex', 'flex-col', 'gap-3')}>
              {linksCol1.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={clsx('font-mono', 'text-sm', 'text-paper', 'hover:text-volt', 'transition-colors')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav col 2 */}
          <div>
            <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-5')}>&nbsp;</p>
            <ul className={clsx('flex', 'flex-col', 'gap-3')}>
              {linksCol2.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={clsx('font-mono', 'text-sm', 'text-paper', 'hover:text-volt', 'transition-colors')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-5')}>Social</p>
            <ul className={clsx('flex', 'flex-col', 'gap-3')}>
              {data.socialLinks.map(({ label, url, short }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx('font-mono', 'text-sm', 'text-paper', 'hover:text-plasma', 'transition-colors', 'flex', 'items-center', 'gap-3')}
                  >
                    <span className={clsx('font-label', 'text-[0.6rem]', 'text-ghost')}>{short}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={clsx('border-t', 'border-smoke', 'pt-8', 'flex', 'flex-col', 'sm:flex-row', 'items-start', 'sm:items-center', 'justify-between', 'gap-4')}>
          <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase')}>
            (C) {new Date().getFullYear()} Kyle De Vares - All rights reserved
          </p>
          <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase')}>
            {data.copyright}
          </p>
        </div>
      </div>

      {/* Poster wall decoration */}
      <div
        className={clsx('absolute', 'inset-0', 'pointer-events-none', 'opacity-[0.03]')}
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #CAFF00 0, #CAFF00 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />
    </footer>
  );
}
