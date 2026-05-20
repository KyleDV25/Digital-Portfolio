import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MagneticButton } from "@/components/MagneticButton";
import { MarqueeBar } from "@/components/MarqueeBar";
import { getProject, getProjects, renderMarkdown, toProjectCard } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { PhotoGallery } from "@/components/PhotoGallery";
import { VideoPlayer } from "@/components/VideoPlayer";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const card = toProjectCard(project);
  
  // Build media gallery items from project data
  const mediaGalleryItems = [
    { type: "image" as const, image: card.imageUrl, altText: card.title },
    ...(project.mediaGallery || []),
  ];

  return (
    <>
      <section
        className="relative min-h-[70vh] flex flex-col justify-end bg-void overflow-hidden"
        style={{ paddingTop: "var(--nav-height)" }}
      >
        <Image
          src={card.imageUrl}
          alt={card.title}
          fill
          priority
          className="object-cover grayscale-[20%] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/45 to-void" />

        <div className="relative z-10 container-punk pb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="tag tag-volt">{card.category}</span>
            <span className="tag">{card.year}</span>
            {card.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-[clamp(3rem,10vw,12rem)] leading-none tracking-tightest text-chalk uppercase">
            {card.title}
          </h1>
        </div>
      </section>

      <MarqueeBar items={[card.category, card.year, ...card.tags].filter(Boolean)} accent="volt" />

      <section className="section-padding bg-ink">
        <div className="container-punk grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
          <div>
            <h2 className="font-display text-[clamp(2rem,5vw,5rem)] leading-none tracking-tightest text-chalk uppercase mb-8">
              Project Overview
            </h2>
            <MarkdownRenderer content={renderMarkdown(project.body || project.description)} />
          </div>

          <aside className="space-y-8 border-t border-smoke pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:border-smoke lg:pl-8">
            {[
              { label: "Year", value: card.year },
              { label: "Category", value: card.category },
              { label: "Focus", value: card.tags.join(", ") || "Creative direction" },
              { label: "Format", value: project.mediaGallery?.length ? "Case study and gallery" : "Case study" },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-smoke pb-6">
                <p className="font-label text-[0.6rem] text-ghost tracking-widest uppercase mb-1">{label}</p>
                <p className="font-mono text-sm text-chalk text-wrap">{value}</p>
              </div>
            ))}

            {project.actionButtons?.map((action) =>
              action.url ? (
                <MagneticButton key={action.label}>
                  <a href={action.url} target="_blank" rel="noopener noreferrer" className="btn-punk">
                    <span>{action.label}</span>
                  </a>
                </MagneticButton>
              ) : null
            )}
          </aside>
        </div>
      </section>

      {mediaGalleryItems.length > 0 && (
        <section className="section-padding bg-void">
          <div className="container-punk">
            <p className="section-eyebrow mb-10">Gallery</p>
            
            {/* Videos */}
            {mediaGalleryItems.filter((item) => item.type === "video").map((item, index) => (
              <div key={`video-${index}`} className="mb-8">
                <VideoPlayer
                  src={item.video || item.videoUrl || ""}
                  poster={item.posterImage}
                  caption={item.caption}
                  accent="volt"
                />
              </div>
            ))}

            {/* Photo Gallery */}
            <PhotoGallery
              items={mediaGalleryItems}
              accent="volt"
            />
          </div>
        </section>
      )}

      <section className="bg-ink border-t border-smoke">
        <Link href="/portfolio" className="group block p-10 hover:bg-ash transition-colors duration-300">
          <p className="font-label text-[0.6rem] text-ghost tracking-widest uppercase mb-3">Back to portfolio</p>
          <p className="font-display text-2xl text-chalk group-hover:text-volt transition-colors uppercase leading-none">
            All Projects
          </p>
        </Link>
      </section>
    </>
  );
}
