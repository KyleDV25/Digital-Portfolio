import fs from "fs";
import path from "path";
import { marked } from "marked";

const root = process.cwd();
const accents = ["volt", "plasma", "ice", "blood"] as const;
const fallbackImage = "/assets/uploads/redesign.png";

export type AccentColor = (typeof accents)[number];

export type Project = {
  title: string;
  slug: string;
  date?: string;
  order?: number | null;
  description: string;
  category?: { label: string; value: string };
  featuredImage?: string;
  keywords?: string[];
  mediaGallery?: Array<{
    type?: "image" | "video";
    image?: string;
    video?: string;
    videoUrl?: string;
    posterImage?: string;
    caption?: string;
    altText?: string;
  }>;
  actionButtons?: Array<{ label: string; url?: string; file?: string; type?: string; style?: string }>;
  body?: string;
};

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  tags: string[];
  accentColor: AccentColor;
  description: string;
};

export type JournalPost = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  body: string;
  mediaGallery?: Array<{
    type?: "image" | "video";
    image?: string;
    video?: string;
    videoUrl?: string;
    posterImage?: string;
    caption?: string;
    altText?: string;
  }>;
};

export type StoreItem = {
  title: string;
  description: string;
  image: string;
  href: string;
  price?: string;
  tags?: string[];
};

export type CommissionPackage = {
  title: string;
  description: string;
  price: string;
  turnaround: string;
  includes: string[];
};

export type SiteData = {
  name: string;
  shortName: string;
  email: string;
  description: string;
  navigation: Array<{ label: string; href: string }>;
  socialLinks: Array<{ name: string; url: string; short: string }>;
  pageHeroes?: Record<string, {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    background?: {
      type: "video" | "image" | "color" | "pattern";
      src?: string;
      color?: string;
      patternColor?: string;
    };
    accent?: "volt" | "plasma" | "ice" | "blood";
  }>;
};

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8")) as T;
  } catch {
    return fallback;
  }
}

function readCollection<T>(dirPath: string): T[] {
  const absolute = path.join(root, dirPath);
  if (!fs.existsSync(absolute)) return [];

  return fs
    .readdirSync(absolute)
    .filter((file) => file.endsWith(".json") && file !== "manifest.json" && file !== "index.json")
    .map((file) => readJson<T>(path.join(dirPath, file), {} as T));
}

export function cleanText(value = "") {
  return value
    .replace(/<!--StartFragment-->|<!--EndFragment-->/g, "")
    .replace(/\u00e2\u20ac[\u201d\u201c\u2013]|[\u2013\u2014]/g, "-")
    .replace(/\u00e2\u20ac\u2122|\u2019/g, "'")
    .replace(/\u00e2\u20ac[\u0153\ufffd]|\u201c|\u201d/g, '"')
    .replace(/\u00c2\u00a3/g, "GBP ")
    .replace(/&amp;/g, "&")
    .replace(/[\u0080-\uFFFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripMarkdown(value = "") {
  return cleanText(value)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .trim();
}

export function renderMarkdown(value = "") {
  const cleaned = cleanText(value);
  return marked.parse(cleaned, { async: false }) as string;
}

function validImage(image?: string) {
  if (!image || image.includes("placeholder.com")) return fallbackImage;
  return image;
}

function projectImage(project: Project) {
  return validImage(
    project.featuredImage ||
      project.mediaGallery?.find((item) => item.type !== "video" && (item.image || item.posterImage))?.image ||
      project.mediaGallery?.find((item) => item.posterImage)?.posterImage
  );
}

function projectYear(project: Project) {
  const year = project.date?.match(/\d{4}/)?.[0];
  return year || "Now";
}

export function getSiteData(): SiteData {
  const settings = readJson<{ email?: string; pageHeroes?: any }>("content/settings.json", {});
  const social = readJson<{ links?: Array<{ name: string; url: string }> }>("content/social_links.json", {});

  return {
    name: "Kyle De Vares",
    shortName: "Kyle",
    email: settings.email || "kyledevares025@gmail.com",
    description:
      "Creative digital artist blending branding, illustration, web experiments, and queer punk visual storytelling.",
    navigation: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Work", href: "/portfolio" },
      { label: "Journal", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    socialLinks: (social.links || [])
      .map((link) => ({
        name: cleanText(link.name),
        url: link.url && link.url !== "#" ? link.url : "#",
        short: cleanText(link.name).slice(0, 2).toUpperCase(),
      }))
      .filter((link) => link.name),
    pageHeroes: settings.pageHeroes,
  };
}

export function getPageHero(pageKey: string) {
  const siteData = getSiteData();
  return siteData.pageHeroes?.[pageKey] || null;
}

export function getProjects(): Project[] {
  return readCollection<Project>("content/projects")
    .filter((project) => project.title && project.slug)
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.date || "").localeCompare(a.date || "");
    });
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}

export function toProjectCard(project: Project, index = 0): ProjectCardData {
  return {
    slug: project.slug,
    title: cleanText(project.title),
    category: cleanText(project.category?.label || "Creative Work"),
    year: projectYear(project),
    imageUrl: projectImage(project),
    tags: (project.keywords || []).slice(0, 3).map(cleanText),
    accentColor: accents[index % accents.length],
    description: cleanText(project.description),
  };
}

export function getProjectCards() {
  return getProjects().map(toProjectCard);
}

export function getJournalPosts(): JournalPost[] {
  const posts = readCollection<JournalPost>("content/journal").filter((post) => post.title && post.slug);
  const source = posts.length
    ? posts
    : [
        {
          title: "Notes From The Digital Mosh Pit",
          slug: "notes-from-the-digital-mosh-pit",
          date: "2026-01-01",
          excerpt: "A working note on building visuals that feel emotional, accessible, and confrontational.",
          tags: ["process", "design", "queer-tech"],
          body: "The portfolio treats typography as atmosphere, navigation as rhythm, and case studies as evidence of care.",
        },
      ];

  return source
    .map((post) => ({
      ...post,
      title: cleanText(post.title),
      excerpt: cleanText(post.excerpt),
      tags: (post.tags || []).map(cleanText),
      body: cleanText(post.body),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getJournalPost(slug: string) {
  return getJournalPosts().find((post) => post.slug === slug);
}

export function getStoreItems(): StoreItem[] {
  const items = readCollection<StoreItem>("content/store");
  return items.map((item) => ({
    ...item,
    title: cleanText(item.title),
    description: cleanText(item.description),
    image: validImage(item.image),
    price: cleanText(item.price || "Quote based"),
    tags: (item.tags || []).map(cleanText),
  }));
}

export function getCommissionPackages(): CommissionPackage[] {
  return readCollection<CommissionPackage>("content/commissions").map((item) => ({
    ...item,
    title: cleanText(item.title),
    description: cleanText(item.description),
    price: cleanText(item.price),
    turnaround: cleanText(item.turnaround),
    includes: (item.includes || []).map(cleanText),
  }));
}

export function formatDate(value?: string) {
  if (!value) return "Studio note";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}
