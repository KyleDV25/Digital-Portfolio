import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { getSiteData } from "@/lib/content";

const site = getSiteData();

export const metadata: Metadata = {
  title: {
    default: `${site.name} - Creative Digital Portfolio`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  keywords: ["Kyle De Vares", "digital art", "branding", "illustration", "web development", "portfolio"],
  openGraph: {
    title: `${site.name} - Creative Digital Portfolio`,
    description: site.description,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - Creative Digital Portfolio`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400;1,700;1,900&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-paper overflow-x-hidden">
        <div className="noise-overlay" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />

        <LoadingScreen />
        <CustomCursor />
        <SmoothScrollProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
