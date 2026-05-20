import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const rootDir = process.cwd();
const projectSourceDir = path.join(rootDir, 'content', 'projects');
const generatedProjectDir = path.join(rootDir, 'content', 'generated', 'projects');

marked.setOptions({
    gfm: true,
    breaks: false
});

await buildProjectContent();

async function buildProjectContent() {
    await fs.rm(generatedProjectDir, { recursive: true, force: true });
    await fs.mkdir(generatedProjectDir, { recursive: true });

    const dirEntries = await fs.readdir(projectSourceDir, { withFileTypes: true });
    const projectFiles = dirEntries.filter(
        (entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name.toLowerCase() !== 'manifest.json'
    );
    const compiledProjects = [];

    for (const entry of projectFiles) {
        const sourcePath = path.join(projectSourceDir, entry.name);
        const raw = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
        const compiled = compileProject(raw, entry.name);

        compiledProjects.push(compiled);

        await fs.writeFile(
            path.join(generatedProjectDir, `${compiled.slug}.json`),
            `${JSON.stringify(compiled, null, 2)}\n`
        );
    }

    compiledProjects.sort(compareProjects);

    const indexPayload = compiledProjects.map((project) => ({
        title: project.title,
        description: project.description,
        summary: project.summary,
        category: project.category,
        categoryValue: project.categoryValue,
        image: project.image,
        featuredImage: project.featuredImage,
        slug: project.slug,
        date: project.date,
        order: project.order,
        keywords: project.keywords
    }));

    await fs.writeFile(
        path.join(generatedProjectDir, 'index.json'),
        `${JSON.stringify(indexPayload, null, 2)}\n`
    );

    console.log(`Generated ${compiledProjects.length} project file(s) in content/generated/projects.`);
}

function compileProject(raw, filename) {
    const modern = hasModernSchema(raw);
    const legacyBody = modern ? '' : pickString(raw.description, '');
    const body = pickString(raw.body, legacyBody);
    const summary = buildSummary(raw, body, modern);
    const category = normalizeCategory(raw);
    const mediaGallery = normalizeMediaGallery(raw.mediaGallery || raw.gallery || []);
    const featuredImage = pickString(raw.featuredImage, raw.image, firstImageFromGallery(mediaGallery), '');
    const displayImage = featuredImage || createPlaceholderImage(raw.title || 'Project');
    const actionButtons = normalizeActionButtons(raw.actionButtons || raw.project_buttons || [], raw.githubUrl || raw.github_url);
    const highlightBox = normalizeHighlightBox(raw.highlightBox, raw.mini_description);
    const slug = slugify(raw.slug || raw.title || raw.project_id || filename.replace(/\.json$/i, ''));
    const normalizedBody = normalizeRichText(body || '');

    return {
        title: pickString(raw.title, humanizeSlug(slug)),
        slug,
        description: summary,
        summary,
        category: category.label,
        categoryValue: category.value,
        image: displayImage,
        featuredImage: displayImage,
        date: normalizeDate(raw.date),
        order: normalizeOrder(raw.order),
        keywords: uniqueStrings([...(Array.isArray(raw.keywords) ? raw.keywords : []), ...(Array.isArray(raw.tags) ? raw.tags : [])]),
        highlightBox,
        actionButtons,
        mediaGallery,
        body: normalizedBody,
        bodyHtml: renderBody(normalizedBody)
    };
}

function hasModernSchema(raw) {
    return (
        Object.prototype.hasOwnProperty.call(raw, 'body') ||
        Object.prototype.hasOwnProperty.call(raw, 'highlightBox') ||
        Object.prototype.hasOwnProperty.call(raw, 'mediaGallery') ||
        Object.prototype.hasOwnProperty.call(raw, 'actionButtons') ||
        typeof raw.category === 'object'
    );
}

function buildSummary(raw, body, modern) {
    if (modern) {
        return pickString(raw.description, extractSummary(body));
    }

    return pickString(raw.mini_description, extractSummary(raw.description), extractSummary(body));
}

function normalizeCategory(raw) {
    if (raw.category && typeof raw.category === 'object') {
        const label = pickString(raw.category.label, 'Featured');
        return {
            label,
            value: pickString(raw.category.value, slugify(label))
        };
    }

    if (typeof raw.category === 'string' && raw.category.trim()) {
        return {
            label: raw.category.trim(),
            value: pickString(raw.categoryValue, slugify(raw.category))
        };
    }

    const label = inferLegacyCategory(raw);
    return {
        label,
        value: slugify(label)
    };
}

function normalizeMediaGallery(items) {
    return (Array.isArray(items) ? items : [])
        .map((item) => normalizeMediaItem(item))
        .filter(Boolean);
}

function normalizeMediaItem(item) {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const isVideo = (item.type || '').toLowerCase() === 'video' || hasVideoSource(item);
    const type = isVideo ? 'video' : 'image';
    const video = pickString(item.video, item.videoUrl, item.url, item.file);
    const image = pickString(item.image, '');

    if (type === 'image' && !image) {
        return null;
    }

    if (type === 'video' && !video) {
        return null;
    }

    return {
        type,
        image,
        video,
        posterImage: pickString(item.posterImage, item.poster, ''),
        caption: pickString(item.caption, ''),
        altText: pickString(item.altText, item.alt, item.caption, '')
    };
}

function normalizeActionButtons(items, githubUrl) {
    const buttons = [];

    if (githubUrl) {
        buttons.push({
            label: 'View Code',
            type: 'link',
            style: 'primary',
            href: githubUrl
        });
    }

    for (const item of Array.isArray(items) ? items : []) {
        if (!item || typeof item !== 'object') {
            continue;
        }

        const href = pickString(item.href, item.url, item.file, '');
        if (!href) {
            continue;
        }

        const type = String(item.type || '').toLowerCase() === 'download' || item.file ? 'download' : 'link';
        buttons.push({
            label: pickString(item.label, item.text, type === 'download' ? 'Download File' : 'Open Link'),
            type,
            style: pickString(item.style, type === 'download' ? 'secondary' : 'primary'),
            href
        });
    }

    return buttons;
}

function normalizeHighlightBox(highlightBox, legacySummary) {
    if (highlightBox && typeof highlightBox === 'object') {
        const body = pickString(highlightBox.body, '');
        if (!body) {
            return null;
        }

        return {
            style: pickString(highlightBox.style, 'info'),
            title: pickString(highlightBox.title, 'Project Snapshot'),
            body
        };
    }

    if (typeof legacySummary === 'string' && legacySummary.trim()) {
        return {
            style: 'info',
            title: 'Project Snapshot',
            body: legacySummary.trim()
        };
    }

    return null;
}

function hasVideoSource(item) {
    const videoLike = pickString(item.video, item.videoUrl, item.url, item.file, '');
    return /\.(mp4|webm|ogg|mov)$/i.test(videoLike);
}

function firstImageFromGallery(items) {
    return items.find((item) => item.type === 'image' && item.image)?.image || '';
}

function renderBody(body) {
    if (!body) {
        return '';
    }

    return looksLikeHtml(body) ? body : marked.parse(body);
}

function extractSummary(value) {
    const plain = stripMarkup(value).replace(/\s+/g, ' ').trim();
    if (!plain) {
        return '';
    }

    if (plain.length <= 190) {
        return plain;
    }

    return `${plain.slice(0, 187).trimEnd()}...`;
}

function stripMarkup(value) {
    return String(value || '')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
        .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
        .replace(/[`*_>#-]/g, ' ')
        .replace(/<[^>]+>/g, ' ');
}

function normalizeRichText(value) {
    return String(value || '')
        .replace(/<!--StartFragment-->/gi, '')
        .replace(/<!--EndFragment-->/gi, '')
        .replace(/<!---->/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/([^\n])(\*+\s+\*\*)/g, '$1\n$2')
        .replace(/([^\n])(####\s+)/g, '$1\n$2')
        .trim();
}

function looksLikeHtml(value) {
    const cleaned = String(value || '').replace(/<!--[\s\S]*?-->/g, '').trim();
    return /^<(h[1-6]|p|ul|ol|li|div|section|article|blockquote|figure|img|video|iframe|hr|pre|code)\b/i.test(cleaned);
}

function inferLegacyCategory(raw) {
    const haystack = [raw.title, raw.project_id, raw.description, ...(raw.tags || []), ...(raw.keywords || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const marketingSignals = ['marketing', 'campaign', 'seo', 'social media', 'content strategy', 'email'];
    const codingSignals = ['javascript', 'typescript', 'node', 'next.js', 'react', 'html', 'css', 'unity', 'game', 'bot', 'app', 'web'];
    const designSignals = ['design', 'illustration', 'logo', 'branding', 'poster', 'typography', 'identity', 'creative'];

    if (includesAny(haystack, marketingSignals)) {
        return 'Marketing';
    }

    if (includesAny(haystack, codingSignals)) {
        return 'Coding';
    }

    if (includesAny(haystack, designSignals)) {
        return 'Graphic Design';
    }

    return 'Graphic Design';
}

function includesAny(value, signals) {
    return signals.some((signal) => value.includes(signal));
}

function normalizeDate(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toISOString().slice(0, 10);
}

function normalizeOrder(value) {
    const order = Number(value);
    return Number.isFinite(order) ? order : null;
}

function compareProjects(left, right) {
    if (left.order !== null && right.order !== null && left.order !== right.order) {
        return left.order - right.order;
    }

    if (left.order !== null && right.order === null) {
        return -1;
    }

    if (left.order === null && right.order !== null) {
        return 1;
    }

    const leftDate = left.date ? new Date(left.date).getTime() : 0;
    const rightDate = right.date ? new Date(right.date).getTime() : 0;
    if (leftDate !== rightDate) {
        return rightDate - leftDate;
    }

    return left.title.localeCompare(right.title);
}

function pickString(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return '';
}

function uniqueStrings(values) {
    const entries = Array.isArray(values) ? values : [];
    return Array.from(
        new Set(
            entries
                .map((value) => String(value || '').trim())
                .filter(Boolean)
        )
    );
}

function humanizeSlug(value) {
    return String(value || '')
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function slugify(value) {
    return String(value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function createPlaceholderImage(title) {
    const safeTitle = encodeURIComponent(String(title || 'Project'));
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23dbeafe'/%3E%3Cstop offset='100%25' stop-color='%23f8fbff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='700' fill='url(%23g)'/%3E%3Ccircle cx='1010' cy='140' r='130' fill='%2325aae1' fill-opacity='0.12'/%3E%3Ccircle cx='170' cy='560' r='170' fill='%23177ca8' fill-opacity='0.1'/%3E%3Ctext x='80' y='340' fill='%23177ca8' font-family='Arial, sans-serif' font-size='52' font-weight='700'%3E${safeTitle}%3C/text%3E%3C/svg%3E`;
}
