import { HomePageClient } from "@/components/HomePageClient";
import { getAboutData, getJournalPosts, getProjectCards, getSiteData } from "@/lib/content";

export default function HomePage() {
  const about = getAboutData();

  return (
    <HomePageClient
      site={getSiteData()}
      aboutSummary={
        about.bio[0] ||
        "Kyle De Vares is a creative digital artist building bold visual systems, commissions, and web experiments."
      }
      projects={getProjectCards()}
      posts={getJournalPosts()}
    />
  );
}
