class AnimationController {
    constructor() {
        this.filterDuration = 340;
        this.progressBar = null;
        this.animationObserver = null;
        this.imageObserver = null;
        this.onScroll = this.updateScrollProgress.bind(this);
        this.onResize = this.updateScrollProgress.bind(this);
        this.init();
    }

    init() {
        this.ensureProgressBar();
        this.createObservers();
        this.setupScrollProgress();
        this.bindFilterButtons(document);
        this.refresh(document);
    }

    ensureProgressBar() {
        this.progressBar = document.getElementById('scrollProgress');

        if (!this.progressBar) {
            this.progressBar = document.createElement('div');
            this.progressBar.id = 'scrollProgress';
            this.progressBar.className = 'scroll-progress';
            document.body.prepend(this.progressBar);
        }
    }

    createObservers() {
        if ('IntersectionObserver' in window) {
            this.animationObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            this.animationObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.18,
                    rootMargin: '0px 0px -10% 0px'
                }
            );

            this.imageObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.imageObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.15,
                    rootMargin: '200px 0px'
                }
            );
        }
    }

    setupScrollProgress() {
        this.updateScrollProgress();
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize);
    }

    updateScrollProgress() {
        if (!this.progressBar) {
            return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        this.progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
    }

    refresh(root = document) {
        this.decorateSections(root);
        this.decorateProjectCards(root);
        this.decorateContactCards(root);
        this.prepareImages(root);
        this.observeAnimations(root);
        this.observeImages(root);
        this.bindFilterButtons(root);
        this.ensureDefaultFilterState();
        this.syncEmptyState();
        this.updateScrollProgress();
    }

    decorateSections(root) {
        this.queryAll(root, 'section').forEach((section) => {
            if (section.dataset.motionReady === 'true') {
                return;
            }

            const isHero = section.classList.contains('hero-section') || section.querySelector('.hero-header');
            const hasProjectGrid = section.querySelector('#projects-grid, #all-projects-grid');
            const contentTarget = section.querySelector(':scope > .max-w-7xl, :scope > .max-w-6xl, :scope > .max-w-4xl, :scope > .relative.z-20');

            if (hasProjectGrid) {
                section.dataset.motionReady = 'true';
                return;
            }

            if (!isHero && contentTarget) {
                contentTarget.classList.add('fade-in');
            } else if (!isHero) {
                section.classList.add('fade-in');
            }

            section.dataset.motionReady = 'true';
        });
    }

    decorateProjectCards(root) {
        this.queryAll(root, '.project-card').forEach((card, index) => {
            if (card.dataset.motionReady === 'true') {
                return;
            }

            card.classList.add('filter-transition', index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
            card.dataset.motionReady = 'true';
        });
    }

    decorateContactCards(root) {
        this.queryAll(root, '.contact-card').forEach((card, index) => {
            if (card.dataset.motionReady === 'true') {
                return;
            }

            card.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
            card.dataset.motionReady = 'true';
        });
    }

    prepareImages(root) {
        this.queryAll(root, 'img').forEach((image) => {
            if (!image.hasAttribute('decoding')) {
                image.decoding = 'async';
            }

            if (!image.closest('#hero-section') && !image.closest('nav') && !image.hasAttribute('loading')) {
                image.loading = 'lazy';
            }
        });
    }

    observeAnimations(root) {
        const elements = this.queryAll(root, '.fade-in, .slide-in-left, .slide-in-right');

        elements.forEach((element) => {
            if (element.dataset.observed === 'true') {
                return;
            }

            element.dataset.observed = 'true';

            if (this.animationObserver) {
                this.animationObserver.observe(element);
            } else {
                element.classList.add('visible');
            }
        });
    }

    observeImages(root) {
        const images = this.queryAll(root, 'img[data-src]');

        images.forEach((image) => {
            if (image.dataset.lazyObserved === 'true') {
                return;
            }

            image.dataset.lazyObserved = 'true';

            if (this.imageObserver) {
                this.imageObserver.observe(image);
            } else {
                this.loadImage(image);
            }
        });
    }

    loadImage(image) {
        const source = image.dataset.src;
        if (!source) {
            return;
        }

        const shell = image.closest('.media-shell');
        const finalize = () => {
            if (shell) {
                shell.classList.remove('loading');
                shell.classList.add('is-loaded');
            }
            image.classList.add('is-loaded');
        };

        image.addEventListener('load', finalize, { once: true });
        image.addEventListener(
            'error',
            () => {
                if (shell) {
                    shell.classList.remove('loading');
                }
            },
            { once: true }
        );

        image.src = source;
        image.removeAttribute('data-src');

        if (image.complete) {
            finalize();
        }
    }

    bindFilterButtons(root) {
        this.queryAll(root, '.filter-btn').forEach((button) => {
            if (button.dataset.filterBound === 'true') {
                return;
            }

            button.dataset.filterBound = 'true';
            button.addEventListener('click', () => {
                this.setActiveFilter(button);
                this.applyFilter(button.dataset.filter || 'all');
            });
        });
    }

    ensureDefaultFilterState() {
        const buttons = Array.from(document.querySelectorAll('.filter-btn'));
        if (!buttons.length || buttons.some((button) => button.classList.contains('active'))) {
            return;
        }

        this.setActiveFilter(buttons[0]);
    }

    setActiveFilter(activeButton) {
        document.querySelectorAll('.filter-btn').forEach((button) => {
            button.classList.toggle('active', button === activeButton);
        });
    }

    applyFilter(filter) {
        const cards = Array.from(document.querySelectorAll('.project-card'));
        if (!cards.length) {
            return;
        }

        cards.forEach((card) => {
            const matches = filter === 'all' || card.dataset.category === filter;
            window.clearTimeout(card.filterTimer);

            if (matches) {
                card.hidden = false;
                card.classList.remove('is-hiding');
                requestAnimationFrame(() => {
                    card.classList.add('is-visible');
                });
            } else {
                card.classList.remove('is-visible');
                card.classList.add('is-hiding');
                card.filterTimer = window.setTimeout(() => {
                    card.hidden = true;
                }, this.filterDuration);
            }
        });

        window.setTimeout(() => {
            this.syncEmptyState(filter);
        }, this.filterDuration + 20);
    }

    syncEmptyState(filter = this.getActiveFilter()) {
        const grid = document.getElementById('all-projects-grid') || document.getElementById('projects-grid');
        if (!grid) {
            return;
        }

        const visibleCards = Array.from(grid.querySelectorAll('.project-card')).filter((card) => !card.hidden);
        const emptyState = grid.querySelector('.empty-state');

        if (visibleCards.length > 0) {
            if (emptyState) {
                emptyState.remove();
            }
            return;
        }

        if (emptyState) {
            this.updateEmptyStateText(emptyState, filter);
            return;
        }

        const state = document.createElement('div');
        state.className = 'empty-state';
        state.innerHTML = `
            <div class="empty-state-inner">
                <span class="empty-state-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9a2.25 2.25 0 114.5 0c0 1.5-2.25 2.25-2.25 2.25"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5h.008v.008H12z"></path>
                        <circle cx="12" cy="12" r="9"></circle>
                    </svg>
                </span>
                <h3>No projects match this filter</h3>
                <p>Try another category or switch back to "All" to see the full set.</p>
            </div>
        `;

        this.updateEmptyStateText(state, filter);
        grid.appendChild(state);

        requestAnimationFrame(() => {
            state.classList.add('visible');
        });
    }

    updateEmptyStateText(emptyState, filter) {
        const label = filter && filter !== 'all' ? filter.replace(/-/g, ' ') : 'selected';
        const paragraph = emptyState.querySelector('p');

        if (paragraph) {
            paragraph.textContent = `No projects are available in ${label}. Try another category or switch back to "All".`;
        }
    }

    getActiveFilter() {
        return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    }

    queryAll(root, selector) {
        if (root instanceof Element) {
            const matchesRoot = root.matches(selector) ? [root] : [];
            return matchesRoot.concat(Array.from(root.querySelectorAll(selector)));
        }

        return Array.from(document.querySelectorAll(selector));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});
