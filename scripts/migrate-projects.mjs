import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const projectDir = path.join(rootDir, 'content', 'projects');
const backupDir = path.join(rootDir, 'content', 'backups', 'projects-legacy');

await migrateProjects();

async function migrateProjects() {
    const entries = await fs.readdir(projectDir, { withFileTypes: true });
    const files = entries.filter(
        (entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name.toLowerCase() !== 'manifest.json'
    );

    await fs.mkdir(backupDir, { recursive: true });

    const migrated = [];

    for (const entry of files) {
        const sourcePath = path.join(projectDir, entry.name);
        const rawText = await fs.readFile(sourcePath, 'utf8');
        const raw = JSON.parse(rawText);
        const nextProject = transformProject(raw, entry.name);
        const targetName = `${nextProject.slug}.json`;
        const backupPath = path.join(backupDir, entry.name);

        await fs.writeFile(backupPath, rawText);
        migrated.push({ sourcePath, targetName, nextProject });
    }

    for (const { sourcePath } of migrated) {
        await fs.rm(sourcePath, { force: true });
    }

    for (const { targetName, nextProject } of migrated) {
        await fs.writeFile(
            path.join(projectDir, targetName),
            `${JSON.stringify(nextProject, null, 2)}\n`
        );
    }

    console.log(`Migrated ${migrated.length} project file(s). Backups saved to content/backups/projects-legacy.`);
}

function transformProject(raw, filename) {
    const title = pickString(raw.title, humanizeSlug(filename.replace(/\.json$/i, '')));
    const slug = slugify(raw.slug || title || raw.project_id);
    const categoryLabel = inferCategory(raw);
    const categoryValue = slugify(categoryLabel);
    const gallery = normalizeGallery(raw.gallery || []);
    const featuredImage = pickString(raw.featuredImage, raw.image, gallery.find((item) => item.type === 'image')?.image, '');
    const summary = pickString(raw.mini_description, extractSummary(raw.description));
    const buttons = normalizeButtons(raw.project_buttons || [], raw.github_url);

    return {
        title,
        slug,
        date: normalizeDate(raw.date),
        order: normalizeOrder(raw.order),
        description: summary,
        category: {
            label: categoryLabel,
            value: categoryValue
        },
        featuredImage,
        keywords: uniqueStrings([...(Array.isArray(raw.keywords) ? raw.keywords : []), ...(Array.isArray(raw.tags) ? raw.tags : [])]),
        highlightBox: summary
            ? {
                  style: 'info',
                  title: 'Project Snapshot',
                  body: summary
              }
            : null,
        actionButtons: buttons,
        mediaGallery: gallery,
        body: pickString(raw.body, raw.description)
    };
}

function normalizeGallery(items) {
    return (Array.isArray(items) ? items : [])
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }

            const video = pickString(item.video, item.videoUrl, item.url, item.file);
            const type = (item.type || '').toLowerCase() === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(video)
                ? 'video'
                : 'image';

            if (type === 'image' && !item.image) {
                return null;
            }

            if (type === 'video' && !video) {
                return null;
            }

            return {
                type,
                image: pickString(item.image, ''),
                video,
                posterImage: pickString(item.posterImage, item.poster, ''),
                caption: pickString(item.caption, ''),
                altText: pickString(item.altText, item.alt, item.caption, '')
            };
        })
        .filter(Boolean);
}

function normalizeButtons(items, githubUrl) {
    const buttons = [];

    if (githubUrl) {
        buttons.push({
            label: 'View Code',
            type: 'link',
            style: 'primary',
            url: githubUrl,
            file: ''
        });
    }

    for (const item of Array.isArray(items) ? items : []) {
        const file = pickString(item.file, '');
        const url = pickString(item.href, item.url, '');
        const href = file || url;
        if (!href) {
            continue;
        }

        buttons.push({
            label: pickString(item.label, item.text, file ? 'Download File' : 'Open Link'),
            type: file ? 'download' : 'link',
            style: file ? 'secondary' : 'primary',
            url,
            file
        });
    }

    return buttons;
}

function inferCategory(raw) {
    const haystack = [raw.title, raw.project_id, raw.description, ...(raw.tags || []), ...(raw.keywords || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    if (includesAny(haystack, ['marketing', 'campaign', 'seo', 'social media', 'content strategy', 'email'])) {
        return 'Marketing';
    }

    if (includesAny(haystack, ['javascript', 'typescript', 'node', 'next.js', 'react', 'html', 'css', 'unity', 'game', 'bot', 'app', 'web'])) {
        return 'Coding';
    }

    return 'Graphic Design';
}

function includesAny(value, signals) {
    return signals.some((signal) => value.includes(signal));
}

function extractSummary(value) {
    const plain = String(value || '')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
        .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
        .replace(/[`*_>#-]/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!plain) {
        return '';
    }

    return plain.length <= 190 ? plain : `${plain.slice(0, 187).trimEnd()}...`;
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
