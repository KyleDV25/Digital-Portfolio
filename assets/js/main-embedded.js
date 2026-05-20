// Load projects from CMS
async function loadProjects() {
    try {
        const response = await fetch('./content/generated/projects/index.json');
        const projects = await response.json();
        
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
            
            // Setup filter functionality
            setupFilters();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback projects for demo
        loadFallbackProjects();
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow';
    card.dataset.category = project.category.toLowerCase().replace(' ', '-');
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="font-bowlby text-2xl text-custom-blue-600 mb-3">${project.title}</h3>
            <p class="text-gray-700 mb-4">${project.description}</p>
            <a href="article.html?id=${project.slug}" class="text-custom-blue-600 font-semibold hover:text-custom-blue-700 inline-flex items-center">
                Read More
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    `;
    
    return card;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-custom-blue-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            button.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            button.classList.add('bg-custom-blue-600', 'text-white');
            
            // Filter projects
            const filter = button.dataset.filter;
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function loadFallbackProjects() {
    const fallbackProjects = [
        {
            title: "Brand Identity Design",
            description: "Complete brand identity package for a tech startup including logo, color palette, and marketing materials.",
            category: "Graphic Design",
            image: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Brand+Identity",
            slug: "brand-identity"
        },
        {
            title: "E-commerce Marketing Campaign",
            description: "Digital marketing campaign that increased online sales by 150% through targeted social media advertising.",
            category: "Marketing",
            image: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Marketing+Campaign",
            slug: "ecommerce-marketing"
        },
        {
            title: "Portfolio Website Development",
            description: "Custom responsive website built with modern web technologies for a creative agency.",
            category: "Coding",
            image: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Web+Development",
            slug: "portfolio-website"
        }
    ];
    
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        
        fallbackProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        setupFilters();
    }
}

function setupSmoothScrolling() {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupContactForm() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupSmoothScrolling();
    setupContactForm();
});
