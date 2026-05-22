/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FORMSPREE_FORM_ID: process.env.FORMSPREE_FORM_ID,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/portfolio", permanent: true },
      { source: "/projects/:slug", destination: "/portfolio/:slug", permanent: true },
      { source: "/journal", destination: "/blog", permanent: true },
      { source: "/journal/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
