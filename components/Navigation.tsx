"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { MagneticButton } from "@/components/MagneticButton";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 1.5 }
    );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      gsap.fromTo(
        menu,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Close on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-void/90 backdrop-blur-sm border-b border-smoke"
            : "bg-transparent"
        }`}
        style={{ height: "var(--nav-height)" }}
      >
        <nav
          className={clsx('container-punk', 'h-full', 'flex', 'items-center', 'justify-between')}
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link href="/" className={clsx('group', 'flex', 'items-center', 'gap-3')} aria-label="Home">
            <span className={clsx('font-display', 'text-xl', 'text-volt', 'tracking-widest', 'group-hover:glow-volt', 'transition-all', 'duration-300')}>
              KYLE
            </span>
            <span className={clsx('w-px', 'h-5', 'bg-smoke')} />
            <span className={clsx('font-label', 'text-[0.6rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'leading-tight')}>
              Digital<br />Artist
            </span>
          </Link>

          {/* Desktop links */}
          <ul className={clsx('hidden', 'lg:flex', 'items-center', 'gap-8')} role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link ${pathname === href ? "text-volt after:w-full" : ""}`}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={clsx('hidden', 'lg:block')}>
            <MagneticButton>
              <Link href="/contact" className="btn-punk">
                <span>Let&apos;s Talk</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </MagneticButton>
          </div>

          {/* Hamburger */}
          <button
            className={clsx('lg:hidden', 'flex', 'flex-col', 'gap-1.5', 'p-2', 'group')}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-6 bg-paper transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-px w-4 bg-paper transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-paper transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu - moved outside header */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className={clsx('lg:hidden', 'fixed', 'inset-0', 'bg-void/95', 'backdrop-blur-md', 'z-[99999]', 'flex', 'flex-col', 'px-8', 'pt-12', 'pb-8', 'overflow-y-auto')}
        >
          <ul className={clsx('flex', 'flex-col', 'gap-2')} role="list">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block font-display text-[clamp(2.5rem,10vw,4rem)] leading-tight tracking-tight uppercase hover:text-volt transition-colors duration-200 ${
                    pathname === href ? "text-volt" : "text-paper"
                  }`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={clsx('mt-auto', 'pt-8', 'pb-8', 'border-t', 'border-smoke', 'flex', 'items-center', 'gap-6')}>
            <a href="#" className="nav-link">IG</a>
            <a href="#" className="nav-link">LI</a>
            <a href="#" className="nav-link">GH</a>
          </div>
        </div>
      )}
    </>
  );
}
