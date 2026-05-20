import type { Metadata } from "next";
import { PortfolioClient } from "@/components/PortfolioClient";
import { PageHero } from "@/components/PageHero";
import { getProjectCards, getPageHero } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected digital art, design, code, and visual storytelling projects by Kyle De Vares.",
};

export default function PortfolioPage() {
  return <PortfolioClient projects={getProjectCards()} />;
}
