# Kyle De Vares - Digital Portfolio

A punk-styled portfolio site built with Next.js, featuring custom animations, photo galleries, video players, and a JSON-based content management system.

## Features

- **Custom Design System**: Punk aesthetic with neon accents (volt, plasma, ice, blood)
- **Animated Components**: Glitch text, smooth transitions, custom cursor
- **Photo Gallery**: Clickable images with lightbox, keyboard navigation
- **Video Player**: Custom controls with play/pause, volume, progress bar
- **Markdown Support**: Rich content with images, links, code blocks
- **JSON CMS**: Easy content management without database
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Proper metadata and semantic HTML

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: GSAP, Lenis (smooth scroll)
- **Content**: JSON files with Markdown
- **Deployment**: Netlify

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Content Management

### Projects
Add/edit projects in `content/projects/*.json`:

```json
{
  "title": "Project Title",
  "slug": "project-title",
  "date": "2026-04-04",
  "order": 1,
  "description": "Short card summary",
  "category": {
    "label": "Coding",
    "value": "coding"
  },
  "featuredImage": "/assets/uploads/example.png",
  "keywords": ["JavaScript", "Portfolio"],
  "mediaGallery": [
    {
      "type": "image",
      "image": "/assets/uploads/example.png",
      "caption": "Gallery image",
      "altText": "Gallery image"
    }
  ],
  "body": "## Markdown body content"
}
```

### Journal Posts
Add/edit journal posts in `content/journal/*.json`:

```json
{
  "title": "Post Title",
  "slug": "post-title",
  "date": "2026-04-04",
  "excerpt": "Post excerpt",
  "tags": ["design", "process"],
  "body": "## Markdown content",
  "mediaGallery": [
    {
      "type": "image",
      "image": "/assets/uploads/example.png",
      "caption": "Image caption"
    }
  ]
}
```

### Page Hero Configuration
Customize page headers in `content/settings.json`:

```json
{
  "pageHeroes": {
    "home": {
      "title": "KYLE",
      "subtitle": "DE VARES",
      "eyebrow": "Creative Digital Artist",
      "background": {
        "type": "pattern",
        "patternColor": "#CAFF00"
      },
      "accent": "volt"
    }
  }
}
```

Background types:
- `pattern`: Diagonal stripe pattern (default)
- `image`: Static image background
- `video`: Auto-playing video background
- `color`: Solid color background

## Deployment to Netlify

### Via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build command: `npm run build:content && npm run build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Environment Variables** (if needed):
   - No environment variables required for this setup

### Manual Deployment

```bash
# Build the site
npm run build:content && npm run build

# Deploy with Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

## File Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── blog/              # Journal/blog pages
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PageHero.tsx      # Customizable hero section
│   ├── PhotoGallery.tsx   # Photo gallery with lightbox
│   ├── VideoPlayer.tsx    # Video player with controls
│   └── ...
├── content/               # JSON content files
│   ├── projects/          # Project data
│   ├── journal/           # Journal posts
│   ├── commissions/       # Commission packages
│   └── settings.json      # Site settings
├── assets/               # Static assets
│   └── uploads/          # User uploaded images
├── lib/                  # Utility functions
├── public/               # Public static files
└── scripts/              # Build scripts
```

## Customization

### Colors
Edit CSS custom properties in `app/globals.css`:

```css
:root {
  --volt: #CAFF00;
  --plasma: #BF00FF;
  --ice: #00FFEE;
  --blood: #FF0035;
  /* ... */
}
```

### Navigation
Update navigation links in `lib/content.ts` (getSiteData function).

### Social Links
Add social links in `content/social_links.json`.

## Build Scripts

- `npm run build:content` - Process content files
- `npm run build` - Build Next.js application
- `npm run dev` - Start development server
- `npm run start` - Start production server

## Performance

- Static generation for fast page loads
- Optimized images with Next.js Image component
- CSS-in-JS with Tailwind CSS
- Lazy loading for images
- Efficient animations with GSAP

## License

© 2026 Kyle De Vares. All rights reserved.
