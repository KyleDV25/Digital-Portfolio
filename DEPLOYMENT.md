# Deployment Guide

## Quick Deploy to Netlify

### Option 1: GitHub Integration (Recommended)

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to github.com and create a new repository
   - Copy the repository URL

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

4. **Connect to Netlify**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize access
   - Choose your repository
   - Use these build settings:
     - **Build command**: `npm run build:content && npm run build`
     - **Publish directory**: `.next`
     - **Node version**: `18`

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site automatically

### Option 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```
   - Follow the prompts to create a new site

4. **Deploy**
   ```bash
   npm run build:content && npm run build
   netlify deploy --prod
   ```

## Environment Variables

No environment variables are required for this setup. All configuration is done through:
- `content/settings.json` - Site settings and page configurations
- `content/social_links.json` - Social media links
- JSON files in `content/` - All content data

## Content Management

### Adding Projects
1. Create a new JSON file in `content/projects/`
2. Follow the schema shown in README.md
3. Run `npm run build:content` locally to test
4. Commit and push to GitHub
5. Netlify will automatically rebuild

### Adding Journal Posts
1. Create a new JSON file in `content/journal/`
2. Follow the schema shown in README.md
3. Commit and push to GitHub
4. Netlify will automatically rebuild

### Updating Settings
1. Edit `content/settings.json` for site-wide settings
2. Edit `content/social_links.json` for social links
3. Commit and push to GitHub
4. Netlify will automatically rebuild

## Custom Domain

1. Go to your site settings in Netlify
2. Click "Domain management"
3. Add your custom domain
4. Update DNS records as instructed by Netlify

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `npm run build:content && npm run build` works locally

### Images Not Loading
- Ensure images are in `assets/uploads/` or `public/`
- Check image paths in JSON files (should start with `/`)
- Verify image files are committed to Git

### Content Not Updating
- Ensure you ran `npm run build:content` after editing JSON files
- Check that JSON files are valid (use a JSON validator)
- Verify files are in the correct `content/` directories

## Performance Tips

- Images are automatically optimized by Next.js
- Static generation ensures fast page loads
- CSS and JS are minified in production
- Assets are cached for 1 year (configured in netlify.toml)

## Support

For issues with:
- **Netlify**: Check Netlify status page and support docs
- **Next.js**: Check Next.js documentation
- **This site**: Review the README.md for configuration details
