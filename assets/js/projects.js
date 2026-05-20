async function loadAllProjects() {
    const projectsGrid = document.getElementById('all-projects-grid');
    if (!projectsGrid) {
        return;
    }

    try {
        const response = await fetch('./content/generated/projects/index.json');
        if (!response.ok) {
            throw new Error('Failed to load project index');
        }

        const projects = await response.json();
        projectsGrid.innerHTML = '';

        projects.forEach((project) => {
            projectsGrid.appendChild(createProjectCard(project));
        });

        window.animationController?.refresh(projectsGrid);
    } catch (error) {
        console.error('Error loading projects:', error);
        loadFallbackProjects();
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card bg-white rounded-2xl shadow-lg overflow-hidden';
    card.dataset.category = project.category.toLowerCase().replace(/\s+/g, '-');

    card.innerHTML = `
        <div class="media-shell loading">
            <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E"
                data-src="${project.image}"
                alt="${project.title}"
                class="lazy-image h-48 w-full object-cover"
                loading="lazy"
                decoding="async"
            >
        </div>
        <div class="p-6">
            <div class="mb-3">
                <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-custom-blue-600">
                    ${project.category}
                </span>
            </div>
            <h3 class="mb-3 font-bowlby text-2xl text-custom-blue-600">${project.title}</h3>
            <p class="mb-4 text-gray-700">${project.description}</p>
            <a href="article.html?id=${project.slug}" class="btn-glow inline-flex items-center rounded-lg px-4 py-2 font-semibold text-custom-blue-600 transition-all duration-300 hover:text-custom-blue-700">
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
    const projectsGrid = document.getElementById('all-projects-grid');
    if (!projectsGrid) {
        return;
    }

    const fallbackProjects = [
        {
            title: 'Brand Identity Design',
            description: 'Complete brand identity package for a tech startup including logo, color palette, and marketing materials. This project involved extensive research and multiple iterations to create a unique visual identity.',
            category: 'Graphic Design',
            image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Brand+Identity',
            slug: 'brand-identity'
        },
        {
            title: 'E-commerce Marketing Campaign',
            description: 'Digital marketing campaign that increased online sales by 150% through targeted social media advertising and email marketing automation.',
            category: 'Marketing',
            image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Marketing+Campaign',
            slug: 'ecommerce-marketing'
        },
        {
            title: 'Portfolio Website Development',
            description: 'Custom responsive website built with modern web technologies for a creative agency. Features include dynamic content loading and smooth animations.',
            category: 'Coding',
            image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Web+Development',
            slug: 'portfolio-website'
        },
        {
            title: 'Social Media Graphics',
            description: 'Series of engaging social media graphics for a lifestyle brand that increased engagement by 200% across all platforms.',
            category: 'Graphic Design',
            image: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Social+Media',
            slug: 'social-media-graphics'
        },
        {
            title: 'Content Marketing Strategy',
            description: 'Comprehensive content marketing strategy including blog posts, video content, and lead generation funnels.',
            category: 'Marketing',
            image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Content+Strategy',
            slug: 'content-marketing'
        },
        {
            title: 'Mobile App Development',
            description: 'Cross-platform mobile application built with React Native for a fitness tracking startup.',
            category: 'Coding',
            image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Mobile+App',
            slug: 'mobile-app'
        }
    ];

    projectsGrid.innerHTML = '';
    fallbackProjects.forEach((project) => {
        projectsGrid.appendChild(createProjectCard(project));
    });

    window.animationController?.refresh(projectsGrid);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAllProjects();
});
