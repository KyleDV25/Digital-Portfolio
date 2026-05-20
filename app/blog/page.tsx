import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlitchText } from "@/components/GlitchText";
import { MarqueeBar } from "@/components/MarqueeBar";
import { TextReveal } from "@/components/TextReveal";
import { PageHero } from "@/components/PageHero";
import { formatDate, getJournalPosts, getPageHero } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes, essays, and process writing from Kyle De Vares.",
};

const accents = ["text-volt", "text-plasma", "text-ice", "text-blood"];
const borders: Record<string, string> = {
  "text-volt": "border-volt/40",
  "text-plasma": "border-plasma/40",
  "text-ice": "border-ice/40",
  "text-blood": "border-blood/40",
};

export default function BlogPage() {
  const [featured, ...rest] = getJournalPosts();
  const heroConfig = getPageHero("blog");

  return (
    <>
      <PageHero
        title={heroConfig?.title || "WORDS"}
        eyebrow={heroConfig?.eyebrow || "Journal"}
        background={heroConfig?.background}
        accent={heroConfig?.accent || "ice"}
      />

      <MarqueeBar items={["Process", "Design", "Queer Tech", "Notes", "Reflection", "Studio"]} accent="plasma" />

      {featured && (
        <section className="section-padding bg-ink border-b border-smoke">
          <div className="container-punk">
            <p className="section-eyebrow mb-10">Featured post</p>
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" data-hover>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/assets/uploads/redesign.png"
                  alt={featured.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-label text-[0.62rem] tracking-widest uppercase text-volt">
                    {featured.tags[0] || "Journal"}
                  </span>
                  <span className="font-label text-[0.62rem] text-ghost tracking-widest uppercase">{formatDate(featured.date)}</span>
                </div>
                <TextReveal
                  as="h2"
                  split="lines"
                  className="font-display text-[clamp(2.5rem,5vw,6rem)] leading-none tracking-tightest text-chalk uppercase mb-6 group-hover:text-volt transition-colors duration-300"
                >
                  {featured.title}
                </TextReveal>
                <p className="font-mono text-sm text-ghost leading-relaxed">{featured.excerpt}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section-padding bg-void">
        <div className="container-punk">
          <TextReveal as="h2" split="words" className="font-display text-fluid-xl leading-none tracking-tightest text-chalk uppercase mb-14">
            All Posts
          </TextReveal>

          <div className="divide-y divide-smoke">
            {(featured ? rest : getJournalPosts()).map((post, index) => {
              const accent = accents[index % accents.length];

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group flex flex-col md:flex-row items-start md:items-center gap-6 py-8 border-l-0 hover:border-l-2 pl-0 hover:pl-6 transition-all duration-300 ${borders[accent]}`}
                  data-hover
                >
                  <div className="md:w-32 shrink-0">
                    <p className="font-label text-[0.6rem] text-ghost tracking-widest uppercase">{formatDate(post.date)}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[clamp(1.5rem,3vw,3rem)] leading-none tracking-tight text-chalk uppercase mb-2 group-hover:text-volt transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="font-mono text-sm text-ghost leading-relaxed line-clamp-2 max-w-2xl">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`font-label text-[0.62rem] tracking-widest uppercase ${accent}`}>{post.tags[0] || "Note"}</span>
                    <span className={`${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>-&gt;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
