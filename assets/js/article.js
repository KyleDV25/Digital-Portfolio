async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        window.location.href = 'projects.html';
        return;
    }

    try {
        const [article, site] = await Promise.all([fetchProject(articleId), fetchSiteSettings()]);
        renderArticle(article, site);
        initialiseVideoPlayers();
    } catch (error) {
        console.error('Error loading article:', error);
        loadFallbackArticle();
        initialiseVideoPlayers();
    }
}

async function fetchProject(slug) {
    const generatedResponse = await fetch(`./content/generated/projects/${slug}.json`);
    if (generatedResponse.ok) {
        return await generatedResponse.json();
    }

    const sourceResponse = await fetch(`./content/projects/${slug}.json`);
    if (!sourceResponse.ok) {
        throw new Error('Project not found');
    }

    return await sourceResponse.json();
}

async function fetchSiteSettings() {
    try {
        const response = await fetch('./content/settings/site.json');
        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        return null;
    }
}

function renderArticle(article, site) {
    const authorName = site?.branding?.name || site?.meta?.author || 'Kyle De Vares';
    const categoryText = article?.category?.label || article?.category || 'Project';
    const dateText = formatDate(article?.date);
    const featuredImage = article.featuredImage || article.image || firstImageFromGallery(article.mediaGallery || []);

    document.getElementById('article-title').textContent = `${article.title} - ${authorName}`;
    document.getElementById('article-headline').textContent = article.title;
    document.getElementById('article-category').textContent = categoryText;

    const dateElement = document.getElementById('article-date');
    const dateTextElement = document.getElementById('article-date-text');
    if (dateText) {
        dateElement.hidden = false;
        if (dateTextElement) {
            dateTextElement.textContent = dateText;
        }
    } else {
        dateElement.hidden = true;
    }

    const imageElement = document.getElementById('article-image');
    if (featuredImage) {
        imageElement.hidden = false;
        imageElement.src = featuredImage;
        imageElement.alt = article.title;
    } else {
        imageElement.hidden = true;
    }

    renderHighlightBox(article.highlightBox, article.description);
    renderKeywords(article.keywords || []);
    renderActionButtons(article.actionButtons || []);
    renderBody(article.bodyHtml || article.body || article.description || '');
    renderGallery(article.mediaGallery || []);
}

function renderHighlightBox(highlightBox, description) {
    const container = document.getElementById('article-summary-box');
    const content = highlightBox?.body
        ? {
              style: highlightBox.style || 'info',
              title: highlightBox.title || 'Project Snapshot',
              body: highlightBox.body
          }
        : description
          ? {
                style: 'info',
                title: 'Project Snapshot',
                body: description
            }
          : null;

    if (!content) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    container.className = `article-callout article-callout-${escapeClassName(content.style)}`;
    container.innerHTML = `
        <p class="article-callout-eyebrow">${escapeHtml(content.title)}</p>
        <p class="article-callout-body">${escapeHtml(content.body)}</p>
    `;
}

function renderKeywords(keywords) {
    const container = document.getElementById('article-keywords');
    const values = Array.isArray(keywords) ? keywords.filter(Boolean) : [];

    if (!values.length) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = values
        .map((keyword) => `<span class="article-keyword-chip">${escapeHtml(keyword)}</span>`)
        .join('');
}

function renderActionButtons(buttons) {
    const container = document.getElementById('article-actions');
    const values = Array.isArray(buttons) ? buttons.filter((button) => resolveButtonHref(button)) : [];

    if (!values.length) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = values
        .map((button) => {
            const href = resolveButtonHref(button);
            const style = escapeClassName(button.style || 'primary');
            const isDownload = (button.type || '').toLowerCase() === 'download';

            return `
                <a
                    href="${escapeAttribute(href)}"
                    class="article-action-btn article-action-${style}"
                    ${isDownload ? 'download' : 'target="_blank" rel="noreferrer"'}
                >
                    ${escapeHtml(button.label || (isDownload ? 'Download' : 'Open'))}
                </a>
            `;
        })
        .join('');
}

function renderBody(body) {
    const container = document.getElementById('article-body');
    const normalizedBody = normalizeRichText(body);
    container.innerHTML = looksLikeHtml(normalizedBody) ? normalizedBody : plainTextToHtml(normalizedBody);
}

function renderGallery(mediaGallery) {
    const section = document.getElementById('article-gallery-section');
    const container = document.getElementById('article-gallery');
    const items = Array.isArray(mediaGallery) ? mediaGallery.filter(Boolean) : [];

    if (!items.length) {
        section.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    container.innerHTML = items
        .map((item, index) => (item.type === 'video' ? createVideoCard(item, index) : createImageCard(item)))
        .join('');
}

function createImageCard(item) {
    return `
        <figure class="article-media-card">
            <div class="article-media-frame">
                <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.altText || item.caption || 'Project image')}" class="article-media-image">
            </div>
            ${item.caption ? `<figcaption class="article-media-caption">${escapeHtml(item.caption)}</figcaption>` : ''}
        </figure>
    `;
}

function createVideoCard(item, index) {
    const src = item.video || item.videoUrl || item.url || '';
    const label = item.caption || `Video clip ${index + 1}`;

    return `
        <figure class="article-media-card article-video-card">
            <div class="article-video-player" data-player>
                <video
                    class="article-video-element"
                    preload="metadata"
                    playsinline
                    ${item.posterImage ? `poster="${escapeAttribute(item.posterImage)}"` : ''}
                >
                    <source src="${escapeAttribute(src)}">
                </video>
                <button class="article-video-overlay" type="button" data-action="toggle-play" aria-label="Play ${escapeAttribute(label)}">
                    <span class="article-video-overlay-icon" data-overlay-icon>Play</span>
                </button>
                <div class="article-video-controls">
                    <button class="article-video-control" type="button" data-action="toggle-play">Play</button>
                    <input class="article-video-progress" type="range" min="0" max="100" value="0" step="0.1" data-progress aria-label="Video progress">
                    <span class="article-video-time" data-time>0:00 / 0:00</span>
                    <button class="article-video-control" type="button" data-action="toggle-mute">Mute</button>
                </div>
            </div>
            ${item.caption ? `<figcaption class="article-media-caption">${escapeHtml(item.caption)}</figcaption>` : ''}
        </figure>
    `;
}

function initialiseVideoPlayers() {
    document.querySelectorAll('[data-player]').forEach((player) => {
        if (player.dataset.bound === 'true') {
            return;
        }

        player.dataset.bound = 'true';

        const video = player.querySelector('video');
        const progress = player.querySelector('[data-progress]');
        const time = player.querySelector('[data-time]');
        const overlayIcon = player.querySelector('[data-overlay-icon]');

        if (!video || !progress || !time) {
            return;
        }

        const syncUi = () => {
            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            progress.value = duration ? String((currentTime / duration) * 100) : '0';
            time.textContent = `${formatDuration(currentTime)} / ${formatDuration(duration)}`;
            if (overlayIcon) {
                overlayIcon.textContent = video.paused ? 'Play' : 'Pause';
            }
        };

        const togglePlay = () => {
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        };

        player.querySelectorAll('[data-action="toggle-play"]').forEach((button) => {
            button.addEventListener('click', togglePlay);
        });

        player.querySelectorAll('[data-action="toggle-mute"]').forEach((button) => {
            button.addEventListener('click', () => {
                video.muted = !video.muted;
                button.textContent = video.muted ? 'Unmute' : 'Mute';
            });
        });

        progress.addEventListener('input', () => {
            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            if (!duration) {
                return;
            }

            video.currentTime = (Number(progress.value) / 100) * duration;
            syncUi();
        });

        video.addEventListener('loadedmetadata', syncUi);
        video.addEventListener('timeupdate', syncUi);
        video.addEventListener('play', syncUi);
        video.addEventListener('pause', syncUi);
        syncUi();
    });
}

function resolveButtonHref(button) {
    if (!button || typeof button !== 'object') {
        return '';
    }

    return button.href || button.url || button.file || '';
}

function plainTextToHtml(value) {
    return String(value || '')
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function normalizeRichText(value) {
    return String(value || '')
        .replace(/<!--StartFragment-->/gi, '')
        .replace(/<!--EndFragment-->/gi, '')
        .replace(/<!---->/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function looksLikeHtml(value) {
    const cleaned = String(value || '').replace(/<!--[\s\S]*?-->/g, '').trim();
    return /^<(h[1-6]|p|ul|ol|li|div|section|article|blockquote|figure|img|video|iframe|hr|pre|code)\b/i.test(cleaned);
}

function firstImageFromGallery(items) {
    return (Array.isArray(items) ? items : []).find((item) => item.type === 'image' && item.image)?.image || '';
}

function formatDate(dateValue) {
    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDuration(value) {
    if (!Number.isFinite(value) || value <= 0) {
        return '0:00';
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function escapeClassName(value) {
    return String(value || '').replace(/[^a-z0-9-_]/gi, '') || 'info';
}

function loadFallbackArticle() {
    const fallbackArticle = {
        title: 'Sample Project',
        category: 'Graphic Design',
        date: '2024-01-15',
        image: 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Project+Image',
        keywords: ['Branding', 'Identity', 'Design'],
        highlightBox: {
            style: 'accent',
            title: 'Project Snapshot',
            body: 'This is a sample article showing the new CMS-driven callout area, keyword chips, and action button layout.'
        },
        actionButtons: [
            { label: 'Visit Project', type: 'link', style: 'primary', href: '#' },
            { label: 'Download PDF', type: 'download', style: 'secondary', href: '#' }
        ],
        mediaGallery: [
            {
                type: 'image',
                image: 'https://via.placeholder.com/1200x800/DBEAFE/177CA8?text=Gallery+Image',
                caption: 'A sample gallery image'
            }
        ],
        bodyHtml: `
            <h2>Project Overview</h2>
            <p>This is a sample project article. In the live site, this content is compiled from the CMS and rendered with the richer schema.</p>
            <h2>The Challenge</h2>
            <p>The article layout now supports a styled summary box, keyword chips, image and video galleries, and custom action buttons.</p>
            <h2>Results</h2>
            <p>The final structure is easier to manage in the CMS and much closer to a proper portfolio case study format.</p>
        `
    };

    renderArticle(fallbackArticle, null);
}

document.addEventListener('DOMContentLoaded', loadArticle);
