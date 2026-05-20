const SECTION_NAMES = ['hero', 'about', 'projects', 'skills', 'timeline', 'contact', 'footer'];
const GENERATED_PROJECT_INDEX_PATH = './content/generated/projects/index.json';
const HOME_PROJECT_LIMIT_DESKTOP = 6;
const HOME_PROJECT_LIMIT_COMPACT = 4;
const HOME_PROJECT_BREAKPOINT = 1024;

let siteContentCache = null;
let projectCatalogCache = [];
let homeProjectLimit = null;
let homeProjectResizeBound = false;

async function initSite() {
    siteContentCache = await loadSiteContent();
    await loadSections();
    applySiteContent(siteContentCache);
    await loadProjects();
    setupSmoothScrolling();
    setupContactForm();
    window.animationController?.refresh(document);
}

async function loadSiteContent() {
    try {
        const response = await fetch('./content/settings/site.json');
        if (!response.ok) {
            throw new Error('Failed to load site settings');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading site settings:', error);
        return null;
    }
}

async function loadSections() {
    for (const section of SECTION_NAMES) {
        const container = document.getElementById(`${section}-section`);
        if (!container) {
            continue;
        }

        try {
            const response = await fetch(`./Sections/${section}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${section}.html`);
            }

            container.innerHTML = await response.text();
            window.animationController?.refresh(container);
        } catch (error) {
            console.error(`Error loading section "${section}":`, error);
        }
    }
}

function applySiteContent(site) {
    if (!site) {
        return;
    }

    applyMeta(site.meta);
    renderNavigation(site);
    renderBranding(site.branding);
    renderHero(site.hero, site.branding);
    renderAbout(site.about);
    renderProjectSectionContent(site.projectsSection);
    renderProjectsPageContent(site.projectsPage);
    renderSkills(site.skillsSection);
    renderTimeline(site.timelineSection);
    renderContact(site.contactSection);
    renderFooter(site.footer, site.branding);
}

function applyMeta(meta) {
    if (!meta) {
        return;
    }

    if (!document.getElementById('article-headline') && meta.title) {
        document.title = meta.title;
    }

    if (meta.description) {
        let descriptionTag = document.querySelector('meta[name="description"]');
        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.name = 'description';
            document.head.appendChild(descriptionTag);
        }

        descriptionTag.content = meta.description;
    }
}

function renderBranding(branding) {
    if (!branding) {
        return;
    }

    applyTextById('site-brand', branding.name);
    applyTextById('footer-brand-name', branding.name);
    applyTextById('footer-description', branding.description);
}

function renderNavigation(site) {
    const links = Array.isArray(site?.navigation) ? site.navigation : [];
    renderNavContainer('desktop-nav-links', links, true);
    renderNavContainer('mobile-nav-links', links, false);
}

function renderNavContainer(containerId, links, isDesktop) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    container.innerHTML = links
        .map((link) => {
            const href = resolveSiteHref(link.href);
            const classes = isDesktop
                ? 'font-bowlby text-sm sm:text-[18px] text-white transition-colors hover:text-custom-blue-700'
                : 'font-bowlby text-sm text-white transition-colors hover:text-custom-blue-700';

            return `<a href="${href}" class="${classes}">${escapeHtml(link.label)}</a>`;
        })
        .join('');
}

function renderHero(hero, branding) {
    if (!hero) {
        return;
    }

    applyTextById('hero-heading', hero.headline);
    applyTextById('hero-description', hero.description);
    applyLink('hero-primary-cta', hero.primaryCta);
    applyLink('hero-secondary-cta', hero.secondaryCta);

    const heroImage = document.getElementById('hero-profile-image');
    if (heroImage && branding?.profileImage) {
        heroImage.src = branding.profileImage;
        heroImage.alt = branding.name || 'Profile image';
    }
}

function renderAbout(about) {
    if (!about) {
        return;
    }

    applyTextById('about-title', about.title);
    applyTextById('about-body', about.body);

    const image = document.getElementById('about-image');
    if (image && about.image) {
        image.src = about.image;
        image.alt = about.title || 'About image';
    }
}

function renderProjectSectionContent(projectsSection) {
    if (!projectsSection) {
        return;
    }

    applyTextById('projects-section-title', projectsSection.title);
    applyTextById('projects-section-description', projectsSection.description);
    applyLink('projects-section-cta', projectsSection.cta);

    renderFilterButtons('projects-filters', projectsSection.filters, 'dark');
    renderFilterButtons('projects-page-filters', projectsSection.filters, 'solid');
}

function renderProjectsPageContent(projectsPage) {
    if (!projectsPage) {
        return;
    }

    applyTextById('projects-page-title', projectsPage.title);
    applyTextById('projects-page-description', projectsPage.description);
}

function renderSkills(skillsSection) {
    if (!skillsSection) {
        return;
    }

    applyTextById('skills-section-title', skillsSection.title);

    const grid = document.getElementById('skills-grid');
    if (!grid) {
        return;
    }

    grid.innerHTML = (skillsSection.groups || [])
        .map((group) => {
            const accentClasses = group.accentClass || 'bg-blue-100 text-custom-blue-600';
            return `
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="w-16 h-16 ${accentClasses} rounded-full flex items-center justify-center mb-6">
                        ${getSkillIcon(group.icon)}
                    </div>
                    <h4 class="font-bowlby text-2xl text-custom-blue-600 mb-4">${escapeHtml(group.title)}</h4>
                    <ul class="space-y-2 text-gray-700">
                        ${(group.items || []).map((item) => `<li>&bull; ${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            `;
        })
        .join('');
}

function renderTimeline(timelineSection) {
    if (!timelineSection) {
        return;
    }

    applyTextById('timeline-eyebrow', timelineSection.eyebrow);
    applyTextById('timeline-title', timelineSection.title);
    applyTextById('timeline-description', timelineSection.description);

    const stack = document.getElementById('timeline-stack');
    if (!stack) {
        return;
    }

    stack.innerHTML = (timelineSection.items || [])
        .map((item, index) => {
            const sideClass = index % 2 === 0 ? 'timeline-entry-left slide-in-left' : 'timeline-entry-right slide-in-right';
            return `
                <article class="timeline-entry ${sideClass}">
                    <div class="timeline-rail-node" aria-hidden="true">
                        <span></span>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-chip">${escapeHtml(item.period)}</div>
                        <h4 class="timeline-role">${escapeHtml(item.role)}</h4>
                        <p class="timeline-company">${escapeHtml(item.company)}</p>
                        <p class="timeline-copy">${escapeHtml(item.description)}</p>
                    </div>
                </article>
            `;
        })
        .join('');
}

function renderContact(contactSection) {
    if (!contactSection) {
        return;
    }

    applyTextById('contact-eyebrow', contactSection.eyebrow);
    applyTextById('contact-title', contactSection.title);
    applyTextById('contact-description', contactSection.description);
    applyTextById('contact-intro-title', contactSection.introTitle);
    applyTextById('contact-intro-body', contactSection.introBody);
    applyTextById('contact-availability-badge', contactSection.availabilityBadge);

    renderContactDetails(contactSection.details || []);
    renderContactStats(contactSection.stats || []);
    renderSocialLinks('contact-social-links', contactSection.socialLinks || []);

    const form = contactSection.form || {};
    applyTextById('contact-form-eyebrow', form.eyebrow);
    applyTextById('contact-form-title', form.title);
    applyTextById('contact-form-note', form.note);
    applyTextById('contact-form-helper', form.helper);
    applyTextById('contact-name-label', form.nameLabel);
    applyTextById('contact-email-label', form.emailLabel);
    applyTextById('contact-subject-label', form.subjectLabel);
    applyTextById('contact-message-label', form.messageLabel);

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    if (nameInput && form.namePlaceholder) {
        nameInput.placeholder = form.namePlaceholder;
    }
    if (emailInput && form.emailPlaceholder) {
        emailInput.placeholder = form.emailPlaceholder;
    }
    if (subjectInput && form.subjectPlaceholder) {
        subjectInput.placeholder = form.subjectPlaceholder;
    }
    if (messageInput && form.messagePlaceholder) {
        messageInput.placeholder = form.messagePlaceholder;
    }

    const submitButton = document.getElementById('contact-submit-label');
    if (submitButton && form.submitLabel) {
        const label = submitButton.querySelector('span');
        if (label) {
            label.textContent = form.submitLabel;
        }
    }
}

function renderContactDetails(details) {
    const container = document.getElementById('contact-details');
    if (!container) {
        return;
    }

    container.innerHTML = details
        .map((detail) => {
            const valueMarkup = detail.href
                ? `<a href="${detail.href}" class="text-custom-blue-600 font-semibold hover:text-custom-blue-700 transition-colors text-lg">${escapeHtml(detail.value)}</a>`
                : `<p class="text-slate-900 font-semibold text-lg">${escapeHtml(detail.value)}</p>`;

            return `
                <div class="contact-card bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-lg">
                    <div class="flex items-center">
                        <div class="contact-icon-wrap mr-4">
                            ${getContactDetailIcon(detail.icon)}
                        </div>
                        <div>
                            <p class="text-sm text-slate-500 font-semibold uppercase tracking-[0.2em]">${escapeHtml(detail.label)}</p>
                            ${valueMarkup}
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
}

function renderContactStats(stats) {
    const container = document.getElementById('contact-stats');
    if (!container) {
        return;
    }

    container.innerHTML = stats
        .map(
            (stat) => `
                <div class="contact-mini-card">
                    <span>${escapeHtml(stat.label)}</span>
                    <strong>${escapeHtml(stat.value)}</strong>
                </div>
            `
        )
        .join('');
}

function renderSocialLinks(containerId, links) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    container.innerHTML = links
        .map(
            (link) => `
                <a href="${link.url || '#'}" class="social-link w-12 h-12 bg-custom-blue-600 rounded-full flex items-center justify-center text-white hover:bg-custom-blue-700 hover:shadow-lg" aria-label="${escapeHtml(link.platform)}">
                    ${getSocialIcon(link.icon)}
                </a>
            `
        )
        .join('');
}

function renderFooter(footer, branding) {
    if (!footer) {
        return;
    }

    applyTextById('footer-brand-name', branding?.name || '');
    applyTextById('footer-description', footer.description);
    applyTextById('footer-copyright', footer.copyright);

    renderFooterLinks('footer-quick-links', footer.quickLinks || []);
    renderFooterServices(footer.services || []);
    renderFooterLinks('footer-legal-links', footer.legalLinks || [], true);
}

function renderFooterLinks(containerId, links, horizontal = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    if (!horizontal) {
        container.innerHTML = links
            .map(
                (link) => `
                    <li>
                        <a href="${resolveSiteHref(link.href)}" class="footer-link text-white hover:text-gray-200 transition-colors relative inline-block opacity-90 hover:opacity-100">
                            ${escapeHtml(link.label)}
                        </a>
                    </li>
                `
            )
            .join('');
        return;
    }

    container.innerHTML = links
        .map(
            (link) => `
                <a href="${resolveSiteHref(link.href)}" class="footer-link text-white hover:text-gray-200 transition-colors opacity-90 hover:opacity-100">
                    ${escapeHtml(link.label)}
                </a>
            `
        )
        .join('');
}

function renderFooterServices(services) {
    const container = document.getElementById('footer-services');
    if (!container) {
        return;
    }

    container.innerHTML = services
        .map((service) => `<li class="text-white text-sm opacity-90">${escapeHtml(service)}</li>`)
        .join('');
}

function renderFilterButtons(containerId, filters, variant) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    const buttonClass =
        variant === 'dark'
            ? 'filter-btn bg-white/20 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/30 transition-colors shadow-lg'
            : 'filter-btn bg-custom-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-custom-blue-700 transition-all duration-300';

    const items = [{ label: 'All', value: 'all' }].concat(filters || []);
    container.innerHTML = items
        .map((filter, index) => {
            const activeClass = index === 0 ? ' active' : '';
            return `<button class="${buttonClass}${activeClass}" data-filter="${escapeHtml(filter.value)}">${escapeHtml(filter.label)}</button>`;
        })
        .join('');
}

async function loadProjects() {
    const grids = [document.getElementById('projects-grid'), document.getElementById('all-projects-grid')].filter(Boolean);

    if (!grids.length) {
        return;
    }

    try {
        const response = await fetch(GENERATED_PROJECT_INDEX_PATH);
        if (!response.ok) {
            throw new Error('Failed to load generated project index');
        }

        projectCatalogCache = await response.json();
        renderProjectGrids(projectCatalogCache);
    } catch (error) {
        console.error('Error loading projects:', error);
        projectCatalogCache = loadFallbackProjects();
        renderProjectGrids(projectCatalogCache);
    }

    setupResponsiveProjectGrid();
}

function renderProjectGrids(projects) {
    const homeGrid = document.getElementById('projects-grid');
    const archiveGrid = document.getElementById('all-projects-grid');

    if (homeGrid) {
        renderProjectGrid(homeGrid, projects.slice(0, getHomeProjectLimit()));
    }

    if (archiveGrid) {
        renderProjectGrid(archiveGrid, projects);
    }
}

function renderProjectGrid(grid, projects) {
    grid.innerHTML = '';
    projects.forEach((project) => {
        grid.appendChild(createProjectCard(project));
    });

    window.animationController?.refresh(grid);

    const activeFilter = window.animationController?.getActiveFilter?.() || 'all';
    window.animationController?.applyFilter?.(activeFilter);
}

function setupResponsiveProjectGrid() {
    const homeGrid = document.getElementById('projects-grid');
    if (!homeGrid || !projectCatalogCache.length) {
        return;
    }

    const syncHomeProjects = () => {
        const nextLimit = getHomeProjectLimit();
        if (nextLimit === homeProjectLimit) {
            return;
        }

        homeProjectLimit = nextLimit;
        renderProjectGrid(homeGrid, projectCatalogCache.slice(0, nextLimit));
    };

    syncHomeProjects();

    if (homeProjectResizeBound) {
        return;
    }

    homeProjectResizeBound = true;
    window.addEventListener('resize', syncHomeProjects);
}

function getHomeProjectLimit() {
    return window.innerWidth < HOME_PROJECT_BREAKPOINT ? HOME_PROJECT_LIMIT_COMPACT : HOME_PROJECT_LIMIT_DESKTOP;
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card bg-white rounded-2xl shadow-lg overflow-hidden';
    card.dataset.category = project.categoryValue || toFilterValue(project.category);

    card.innerHTML = `
        <div class="media-shell loading">
            <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E"
                data-src="${project.image}"
                alt="${escapeHtml(project.title)}"
                class="lazy-image h-48 w-full object-cover"
                loading="lazy"
                decoding="async"
            >
        </div>
        <div class="p-6">
            <div class="mb-3">
                <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-custom-blue-600">
                    ${escapeHtml(project.category)}
                </span>
            </div>
            <h3 class="mb-3 font-bowlby text-2xl text-custom-blue-600">${escapeHtml(project.title)}</h3>
            <p class="mb-4 text-gray-700">${escapeHtml(project.description)}</p>
            <a href="article.html?id=${encodeURIComponent(project.slug)}" class="btn-glow inline-flex items-center rounded-lg px-4 py-2 font-semibold text-custom-blue-600 transition-all duration-300 hover:text-custom-blue-700">
                Read More
                <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    `;

    return card;
}

function loadFallbackProjects() {
    return [
        {
            title: 'Brand Identity Design',
            description: 'Complete brand identity package for a tech startup including logo, color palette, and marketing materials.',
            category: 'Graphic Design',
            categoryValue: 'graphic-design',
            image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Brand+Identity',
            slug: 'brand-identity'
        }
    ];
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        if (anchor.dataset.scrollBound === 'true') {
            return;
        }

        anchor.dataset.scrollBound = 'true';
        anchor.addEventListener('click', function (event) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

function setupContactForm() {
    const form = document.querySelector('form');
    if (!form || form.dataset.formBound === 'true') {
        return;
    }

    form.dataset.formBound = 'true';
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    });
}

function applyLink(id, link) {
    const element = document.getElementById(id);
    if (!element || !link) {
        return;
    }

    element.textContent = link.label || element.textContent;
    element.href = resolveSiteHref(link.href || '#');
}

function applyTextById(id, value) {
    const element = document.getElementById(id);
    if (element && typeof value === 'string') {
        element.textContent = value;
    }
}

function resolveSiteHref(href) {
    if (!href) {
        return '#';
    }

    if (href.startsWith('#') && !isHomePage()) {
        return `index.html${href}`;
    }

    return href;
}

function isHomePage() {
    const page = window.location.pathname.split('/').pop().toLowerCase();
    return page === '' || page === 'index.html';
}

function toFilterValue(label = '') {
    return label.toLowerCase().replace(/\s+/g, '-');
}

function getSkillIcon(icon) {
    const icons = {
        design: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>`,
        development: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
        marketing: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>`
    };

    return icons[icon] || icons.design;
}

function getContactDetailIcon(icon) {
    const icons = {
        email: `<svg class="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
        phone: `<svg class="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`,
        location: `<svg class="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`
    };

    return icons[icon] || icons.email;
}

function getSocialIcon(icon) {
    const icons = {
        twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
        linkedin: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        instagram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>`
    };

    return icons[icon] || icons.twitter;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    initSite();
});
