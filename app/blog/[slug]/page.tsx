import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getJournalPost, getJournalPosts, renderMarkdown } from "@/lib/content";
import { PhotoGallery } from "@/components/PhotoGallery";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getJournalPost(params.slug);
  if (!post) return { title: "Journal" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getJournalPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <section className="relative bg-void border-b border-smoke overflow-hidden" style={{ paddingTop: "var(--nav-height)" }}>
        <div className="container-punk py-16 lg:py-24 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link href="/blog" className="font-label text-[0.62rem] text-ghost tracking-widest uppercase hover:text-volt transition-colors">
              Back to journal
            </Link>
            <span className="font-label text-[0.62rem] text-volt tracking-widest uppercase">{post.tags[0] || "Journal"}</span>
            <span className="font-label text-[0.62rem] text-ghost tracking-widest uppercase">{formatDate(post.date)}</span>
          </div>
          <h1 className="font-display text-[clamp(3rem,8vw,9rem)] leading-none tracking-tightest text-chalk uppercase">
            {post.title}
          </h1>
        </div>

        <div className="relative aspect-[21/9] overflow-hidden">
          <Image src="/assets/uploads/redesign.png" alt={post.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/20 to-transparent" />
        </div>
      </section>

      <article className="section-padding bg-ink">
        <div className="container-punk max-w-3xl">
          <p className="font-condensed text-[clamp(1.2rem,2.5vw,2rem)] font-400 italic text-chalk leading-relaxed mb-12 border-l-2 border-volt pl-6 text-wrap">
            {post.excerpt}
          </p>

          <MarkdownRenderer content={renderMarkdown(post.body)} />

          <div className="flex flex-wrap gap-2 pt-12 mt-12 border-t border-smoke">
            {post.tags.map((tag) => (
              <span key={tag} className="tag tag-volt">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {post.mediaGallery && post.mediaGallery.length > 0 && (
        <section className="section-padding bg-void">
          <div className="container-punk">
            <p className="section-eyebrow mb-10">Media Gallery</p>
            
            {/* Videos */}
            {post.mediaGallery.filter((item) => item.type === "video").map((item, index) => (
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
              items={post.mediaGallery}
              accent="volt"
            />
          </div>
        </section>
      )}

      <section className="bg-void border-t border-smoke">
        <Link href="/blog" className="group block p-10 hover:bg-ash transition-colors">
          <p className="font-label text-[0.6rem] text-ghost tracking-widest uppercase mb-3">Back</p>
          <p className="font-display text-2xl text-chalk group-hover:text-volt transition-colors uppercase leading-none">All Posts</p>
        </Link>
      </section>
    </>
  );
}
