"use client";

import { useState } from "react";
import { GlitchText } from "@/components/GlitchText";
import { MarqueeBar } from "@/components/MarqueeBar";
import { MagneticButton } from "@/components/MagneticButton";
import { PageHero } from "@/components/PageHero";
import { clsx } from "clsx";


export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to submit form");
      }
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    }

    setSending(false);
  };

  return (
    <>
      <PageHero
        title="GET IN"
        subtitle="TOUCH"
        eyebrow="Contact"
        background={{
          type: "pattern",
          patternColor: "#FF0035"
        }}
        accent="blood"
      />

      <MarqueeBar
        items={["Open for commissions", "Collaborations welcome", "Respond within 48h", "Worldwide"]}
        accent="ice"
      />

      {/* Main grid */}
      <section className={clsx('section-padding', 'bg-ink')}>
        <div className={clsx('container-punk', 'grid', 'grid-cols-1', 'lg:grid-cols-[1fr_420px]', 'gap-16', 'lg:gap-20')}>

          {/* Form */}
          <div>
            {submitted ? (
              <div className={clsx('py-20', 'text-center')}>
                <GlitchText
                  as="p"
                  mode="once"
                  className={clsx('font-display', 'text-[clamp(3rem,8vw,8rem)]', 'text-volt', 'uppercase', 'leading-none', 'tracking-tightest', 'mb-8')}
                >
                  RECEIVED
                </GlitchText>
                <p className={clsx('font-mono', 'text-sm', 'text-ghost')}>
                  I&apos;ll get back to you within 48 hours.
                </p>
              </div>
            ) : (
              <form
                action="https://formspree.io/f/xjgzyzvg"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-10"
              >
                {error && (
                  <div className={clsx('bg-void/50', 'border', 'border-volt', 'text-volt', 'px-4', 'py-3', 'font-mono', 'text-sm')}>
                    {error}
                  </div>
                )}
                {/* Name */}
                <div>
                  <label className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'block', 'mb-2')} htmlFor="name">
                    Your name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="As you'd like to be addressed"
                    className={clsx('input-punk', 'w-full')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'block', 'mb-2')} htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className={clsx('input-punk', 'w-full')}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'block', 'mb-2')} htmlFor="subject">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What's this about?"
                    className={clsx('input-punk', 'w-full')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'block', 'mb-2')} htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell me about your project, timeline, and budget..."
                    rows={6}
                    className={clsx('input-punk', 'textarea-punk', 'w-full')}
                  />
                </div>

                {/* Submit */}
                <MagneticButton>
                  <button
                    type="submit"
                    disabled={sending}
                    className={clsx('btn-punk', 'relative')}
                    aria-disabled={sending}
                  >
                    <span>{sending ? "Sending..." : "Send message"}</span>
                    {!sending && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <aside className={clsx('space-y-10', 'border-t', 'border-smoke', 'pt-10', 'lg:border-t-0', 'lg:pt-0', 'lg:border-l', 'lg:pl-10', 'lg:border-smoke')}>
            <div>
              <p className={clsx('font-label', 'text-[0.62rem]', 'text-volt', 'tracking-widest', 'uppercase', 'mb-4')}>Direct email</p>
              <a
                href="mailto:kyledevares025@gmail.com"
                className={clsx('font-mono', 'text-[clamp(1rem,2.5vw,1.25rem)]', 'text-chalk', 'hover:text-volt', 'transition-colors', 'duration-300', 'text-wrap')}
                data-hover
              >
                kyledevares025@gmail.com
              </a>
            </div>

            <div className={clsx('border-t', 'border-smoke', 'pt-8')}>
              <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-4')}>Response time</p>
              <p className={clsx('font-mono', 'text-sm', 'text-ghost')}>Within 48 hours, usually sooner.</p>
            </div>

            <div className={clsx('border-t', 'border-smoke', 'pt-8')}>
              <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-4')}>Availability</p>
              <div className={clsx('flex', 'items-center', 'gap-3')}>
                <span className={clsx('w-2', 'h-2', 'rounded-full', 'bg-volt', 'animate-pulse-neon')} />
                <p className={clsx('font-mono', 'text-sm', 'text-volt')}>Currently open for projects</p>
              </div>
              <p className={clsx('font-mono', 'text-sm', 'text-ghost', 'mt-3')}>
                Taking commissions and collaborations now.
              </p>
            </div>

            <div className={clsx('border-t', 'border-smoke', 'pt-8')}>
              <p className={clsx('font-label', 'text-[0.62rem]', 'text-ghost', 'tracking-widest', 'uppercase', 'mb-5')}>Socials</p>
              <div className="space-y-3">
                {[
                  { label: "Instagram", href: "#", accent: "hover:text-plasma" },
                  { label: "LinkedIn", href: "#", accent: "hover:text-ice" },
                  { label: "Bear Spirits Arts", href: "#", accent: "hover:text-volt" },
                  { label: "GitHub", href: "#", accent: "hover:text-volt" },
                ].map(({ label, href, accent }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block font-mono text-sm text-ghost transition-colors duration-300 ${accent}`}
                    data-hover
                  >
                    {label} -&gt;
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
