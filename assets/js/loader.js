// Section loader that works with both local server and direct file opening
class SectionLoader {
    constructor() {
        this.sections = ['hero', 'about', 'projects', 'skills', 'timeline', 'contact'];
        this.isLocalServer = window.location.protocol !== 'file:';
    }

    async loadAllSections() {
        if (this.isLocalServer) {
            await this.loadFromServer();
        } else {
            this.loadEmbeddedContent();
        }
        
        // Initialize functionality after sections are loaded
        setTimeout(() => {
            this.initializeFunctionality();
        }, 100);
    }

    async loadFromServer() {
        try {
            for (const section of this.sections) {
                const response = await fetch(`./Sections/${section}.html`);
                const html = await response.text();
                const container = document.getElementById(`${section}-section`);
                if (container) {
                    container.innerHTML = html;
                }
            }
        } catch (error) {
            console.error('Error loading sections from server:', error);
            this.loadEmbeddedContent();
        }
    }

    loadEmbeddedContent() {
        // Fallback content for direct file opening
        const fallbackContent = {
            hero: `
                <section class="relative isolate min-h-screen overflow-hidden bg-white">
                    <div class="pointer-events-none absolute -top-24 -right-16 z-10 h-[38rem] w-[44rem] sm:-top-28 sm:-right-20 sm:h-[44rem] sm:w-[50rem] lg:-top-64 lg:-right-40 lg:h-[62rem] lg:w-[78rem] xl:-top-72 xl:-right-48 xl:h-[68rem] xl:w-[86rem]">
                        <img src="assets/js/hero-blob.svg" alt="" class="h-full w-full object-contain object-right-top">
                    </div>
                    <nav class="absolute inset-x-0 top-0 z-30 px-6 py-6 sm:px-8">
                        <div class="mx-auto flex max-w-7xl items-center justify-between gap-8">
                            <h1 class="font-bowlby text-xl text-black sm:text-2xl">KYLE DE VARES</h1>
                            <div class="hidden items-center gap-8 text-sm font-semibold text-white md:flex">
                                <a href="#about" class="transition-colors hover:text-black">About</a>
                                <a href="#projects" class="transition-colors hover:text-black">Projects</a>
                                <a href="#contact" class="transition-colors hover:text-black">Contact</a>
                            </div>
                        </div>
                    </nav>
                    <div class="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-6 pb-16 pt-28 sm:px-8 sm:pt-32 lg:flex-row lg:items-center lg:gap-0 lg:pb-24 lg:pt-20">
                        <div class="w-full lg:w-[62%]">
                            <div class="max-w-3xl text-center lg:max-w-[54rem] lg:text-left">
                                <h2 class="font-bowlby text-5xl leading-[0.95] text-black sm:text-6xl lg:text-[4.5rem]">
                                    Hello, My name is Kyle De Vares
                                </h2>
                                <p class="mt-8 max-w-xl text-lg text-black/80 sm:text-xl">
                                    Go ahead and say just a little more about what you do.
                                </p>
                                <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                    <button class="rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gray-800">
                                        Call to action
                                    </button>
                                    <button class="rounded-2xl border border-black/20 bg-white px-6 py-4 text-base font-semibold text-black transition-colors hover:bg-gray-100">
                                        Secondary
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="relative flex w-full justify-center lg:w-[38%] lg:justify-end">
                            <div class="relative z-20 lg:translate-x-16 lg:-translate-y-16 xl:translate-x-24 xl:-translate-y-20">
                                <img src="assets/js/img/profile.jpg" alt="Kyle De Vares" class="h-56 w-56 rounded-full border-4 border-white object-cover shadow-2xl sm:h-64 sm:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80">
                            </div>
                        </div>
                    </div>
                </section>
            `,
            about: `
                <section id="about" class="py-20 px-8">
                    <div class="max-w-4xl mx-auto">
                        <h3 class="font-bowlby text-4xl text-custom-blue-600 mb-8 text-center">About me</h3>
                        <div class="bg-gray-50 rounded-3xl p-12 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full filter blur-2xl opacity-30 transform translate-x-20 -translate-y-20"></div>
                            <div class="relative z-10">
                                <p class="text-lg text-gray-700 leading-relaxed">
                                    I'm a passionate creative developer with expertise in web design, graphic design, and digital marketing. 
                                    I love creating beautiful, functional digital experiences that make a difference. With a background in 
                                    both design and development, I bring a unique perspective to every project.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            projects: `
                <section id="projects" class="bg-custom-blue-600 py-20 px-8">
                    <div class="max-w-7xl mx-auto">
                        <h3 class="font-bowlby text-4xl text-custom-blue-600 mb-4 text-center">Projects</h3>
                        <p class="text-center text-white mb-12">Go ahead and say just a little more about what you do.</p>
                        <div class="flex justify-center space-x-4 mb-12">
                            <button class="filter-btn bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors shadow-lg" data-filter="all">All</button>
                            <button class="filter-btn bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors shadow-lg" data-filter="graphic-design">Graphic Design</button>
                            <button class="filter-btn bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors shadow-lg" data-filter="marketing">Marketing</button>
                            <button class="filter-btn bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors shadow-lg" data-filter="coding">Coding</button>
                        </div>
                        <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
                        <div class="text-center mt-12">
                            <a href="projects.html" class="inline-flex items-center bg-white/20 text-custom-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 hover:text-custom-blue-600 transition-colors shadow-lg">
                                View All Projects
                                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
            `,
            skills: `
                <section id="skills" class="py-20 px-8 bg-gray-50">
                    <div class="max-w-6xl mx-auto">
                        <h3 class="font-bowlby text-4xl text-custom-blue-600 mb-12 text-center">Skills</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <svg class="w-8 h-8 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                                    </svg>
                                </div>
                                <h4 class="font-bowlby text-2xl text-custom-blue-600 mb-4">Design</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• UI/UX Design</li>
                                    <li>• Graphic Design</li>
                                    <li>• Brand Identity</li>
                                    <li>• Adobe Creative Suite</li>
                                    <li>• Figma</li>
                                </ul>
                            </div>
                            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                    </svg>
                                </div>
                                <h4 class="font-bowlby text-2xl text-custom-blue-600 mb-4">Development</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• HTML/CSS/JavaScript</li>
                                    <li>• React & Vue.js</li>
                                    <li>• Node.js</li>
                                    <li>• Responsive Design</li>
                                    <li>• Git & GitHub</li>
                                </ul>
                            </div>
                            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                                    </svg>
                                </div>
                                <h4 class="font-bowlby text-2xl text-custom-blue-600 mb-4">Marketing</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• Digital Marketing</li>
                                    <li>• Social Media</li>
                                    <li>• Content Strategy</li>
                                    <li>• SEO Optimization</li>
                                    <li>• Email Marketing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            timeline: `
                <section id="timeline" class="py-20 px-8">
                    <div class="max-w-4xl mx-auto">
                        <h3 class="font-bowlby text-4xl text-custom-blue-600 mb-12 text-center">Timeline</h3>
                        <div class="relative">
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
                            <div class="space-y-12">
                                <div class="relative flex items-center">
                                    <div class="w-1/2 pr-8 text-right">
                                        <div class="bg-white p-6 rounded-2xl shadow-lg inline-block">
                                            <h4 class="font-bowlby text-xl text-custom-blue-600 mb-2">Senior Developer</h4>
                                            <p class="text-gray-600 mb-2">Tech Company Inc.</p>
                                            <p class="text-sm text-gray-500">2022 - Present</p>
                                            <p class="text-gray-700 mt-2">Leading development of web applications and mentoring junior developers.</p>
                                        </div>
                                    </div>
                                    <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-custom-blue-600 rounded-full border-4 border-white"></div>
                                    <div class="w-1/2 pl-8"></div>
                                </div>
                                <div class="relative flex items-center">
                                    <div class="w-1/2 pr-8"></div>
                                    <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-custom-blue-600 rounded-full border-4 border-white"></div>
                                    <div class="w-1/2 pl-8">
                                        <div class="bg-white p-6 rounded-2xl shadow-lg inline-block">
                                            <h4 class="font-bowlby text-xl text-custom-blue-600 mb-2">UI/UX Designer</h4>
                                            <p class="text-gray-600 mb-2">Creative Agency</p>
                                            <p class="text-sm text-gray-500">2020 - 2022</p>
                                            <p class="text-gray-700 mt-2">Designed user interfaces and experiences for various client projects.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            contact: `
                <section id="contact" class="py-20 px-8 bg-gray-50">
                    <div class="max-w-4xl mx-auto">
                        <h3 class="font-bowlby text-4xl text-custom-blue-600 mb-8 text-center">Get In Touch</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <p class="text-lg text-gray-700 mb-8">Have a project in mind? I'd love to hear from you!</p>
                                <div class="space-y-4">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600">Email</p>
                                            <a href="mailto:kyle@example.com" class="text-custom-blue-600 font-semibold">kyle@example.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <form class="bg-white rounded-2xl p-8 shadow-lg">
                                    <div class="mb-6">
                                        <label for="name" class="block text-gray-700 font-semibold mb-2">Name</label>
                                        <input type="text" id="name" name="name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
                                    </div>
                                    <div class="mb-6">
                                        <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
                                        <input type="email" id="email" name="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
                                    </div>
                                    <div class="mb-6">
                                        <label for="message" class="block text-gray-700 font-semibold mb-2">Message</label>
                                        <textarea id="message" name="message" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required></textarea>
                                    </div>
                                    <button type="submit" class="w-full bg-custom-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-custom-blue-700 transition-colors">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            `
        };

        for (const section of this.sections) {
            const container = document.getElementById(`${section}-section`);
            if (container && fallbackContent[section]) {
                container.innerHTML = fallbackContent[section];
            }
        }
    }

    initializeFunctionality() {
        // Load projects
        this.loadProjects();
        // Setup smooth scrolling
        this.setupSmoothScrolling();
        // Setup contact form
        this.setupContactForm();
    }

    async loadProjects() {
        try {
            const response = await fetch('./content/generated/projects/index.json');
            const projects = await response.json();
            
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = '';
                
                projects.forEach(project => {
                    const projectCard = this.createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                });
                
                this.setupFilters();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.loadFallbackProjects();
        }
    }

    createProjectCard(project) {
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

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-custom-blue-600', 'text-white');
                    btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
                });
                button.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
                button.classList.add('bg-custom-blue-600', 'text-white');
                
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

    loadFallbackProjects() {
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
                const projectCard = this.createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
            
            this.setupFilters();
        }
    }

    setupSmoothScrolling() {
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

    setupContactForm() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! I will get back to you soon.');
                form.reset();
            });
        }
    }
}

// Initialize the section loader
const sectionLoader = new SectionLoader();
document.addEventListener('DOMContentLoaded', () => {
    sectionLoader.loadAllSections();
});
