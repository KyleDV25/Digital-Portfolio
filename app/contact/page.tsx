"use client";

import { useState } from "react";
import { GlitchText } from "@/components/GlitchText";
import { MarqueeBar } from "@/components/MarqueeBar";
import { MagneticButton } from "@/components/MagneticButton";
import { PageHero } from "@/components/PageHero";

const SUBJECTS = [
  "Commission a project",
  "Brand identity",
  "Editorial / photography",
  "Fashion film",
  "Collaboration",
  "Something else",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Replace with real form submission (Netlify, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
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
      <section className="section-padding bg-ink">
        <div className="container-punk grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-20">

          {/* Form */}
          <div>
            {submitted ? (
              <div className="py-20 text-center">
                <GlitchText
                  as="p"
                  mode="once"
                  className="font-display text-[clamp(3rem,8vw,8rem)] text-volt uppercase leading-none tracking-tightest mb-8"
                >
                  RECEIVED
                </GlitchText>
                <p className="font-mono text-sm text-ghost">
                  I&apos;ll get back to you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                {/* Name */}
                <div>
                  <label className="font-label text-[0.62rem] text-ghost tracking-widest uppercase block mb-2" htmlFor="name">
                    Your name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="As you'd like to be addressed"
                    className="input-punk w-full"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-label text-[0.62rem] text-ghost tracking-widest uppercase block mb-2" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-punk w-full"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="font-label text-[0.62rem] text-ghost tracking-widest uppercase block mb-2" htmlFor="subject">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="input-punk w-full bg-transparent appearance-none cursor-none"
                    style={{ backgroundImage: "none" }}
                  >
                    <option value="" disabled className="bg-void">Select a subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-void">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="font-label text-[0.62rem] text-ghost tracking-widest uppercase block mb-2" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, and budget..."
                    rows={6}
                    className="input-punk textarea-punk w-full"
                  />
                </div>

                {/* Submit */}
                <MagneticButton>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-punk relative"
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
          <aside className="space-y-10 border-t border-smoke pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-10 lg:border-smoke">
            <div>
              <p className="font-label text-[0.62rem] text-volt tracking-widest uppercase mb-4">Direct email</p>
              <a
                href="mailto:kyledevares025@gmail.com"
                className="font-mono text-[clamp(1rem,2.5vw,1.25rem)] text-chalk hover:text-volt transition-colors duration-300 text-wrap"
                data-hover
              >
                kyledevares025@gmail.com
              </a>
            </div>

            <div className="border-t border-smoke pt-8">
              <p className="font-label text-[0.62rem] text-ghost tracking-widest uppercase mb-4">Response time</p>
              <p className="font-mono text-sm text-ghost">Within 48 hours, usually sooner.</p>
            </div>

            <div className="border-t border-smoke pt-8">
              <p className="font-label text-[0.62rem] text-ghost tracking-widest uppercase mb-4">Availability</p>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-volt animate-pulse-neon" />
                <p className="font-mono text-sm text-volt">Currently open for projects</p>
              </div>
              <p className="font-mono text-sm text-ghost mt-3">
                Taking commissions and collaborations now.
              </p>
            </div>

            <div className="border-t border-smoke pt-8">
              <p className="font-label text-[0.62rem] text-ghost tracking-widest uppercase mb-5">Socials</p>
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
