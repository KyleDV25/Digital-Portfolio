import { HomePageClient } from "@/components/HomePageClient";
import { getJournalPosts, getProjectCards, getSiteData } from "@/lib/content";
import homePageConfig from "@/content/pages/home.json";

export default function HomePage() {
  return (
    <HomePageClient
      site={getSiteData()}
      aboutSummary={
        homePageConfig.aboutSection.summary ||
        "Kyle De Vares is a creative digital artist building bold visual systems, commissions, and web experiments."
      }
      projects={getProjectCards()}
      posts={getJournalPosts()}
    />
  );
}
