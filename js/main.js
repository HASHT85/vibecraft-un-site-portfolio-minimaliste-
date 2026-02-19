// ============================================================
// Main Application Logic
// ============================================================

// ============================================================
// Theme Management
// ============================================================

class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'theme-preference';
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        this.setTheme(initialTheme);
        this.setupToggle();
        this.watchSystemPreference();
    }

    setTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem(this.STORAGE_KEY, 'dark');
            document.getElementById('themeToggle').textContent = '☀️';
        } else {
            html.removeAttribute('data-theme');
            localStorage.setItem(this.STORAGE_KEY, 'light');
            document.getElementById('themeToggle').textContent = '🌙';
        }
    }

    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    watchSystemPreference() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ============================================================
// Project Filtering
// ============================================================

class ProjectFilter {
    constructor() {
        this.allProjects = [];
        this.currentFilter = 'All';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupFilterButtons();
    }

    loadProjects() {
        // Example projects data - Replace with your own
        this.allProjects = [
            {
                id: 1,
                title: 'Portfolio Website',
                description: 'Personal portfolio showcasing projects and skills',
                image: '🌐',
                tags: ['HTML', 'CSS', 'JavaScript'],
                link: '#'
            },
            {
                id: 2,
                title: 'E-commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration',
                image: '🛍️',
                tags: ['React', 'Node.js', 'MongoDB'],
                link: '#'
            },
            {
                id: 3,
                title: 'Task Manager App',
                description: 'Collaborative task management application',
                image: '✅',
                tags: ['Vue', 'Firebase', 'JavaScript'],
                link: '#'
            },
            {
                id: 4,
                title: 'Weather Dashboard',
                description: 'Real-time weather information with forecast',
                image: '🌤️',
                tags: ['HTML', 'CSS', 'API'],
                link: '#'
            },
            {
                id: 5,
                title: 'Blog Platform',
                description: 'Content management system for blogging',
                image: '📝',
                tags: ['React', 'Node.js', 'PostgreSQL'],
                link: '#'
            },
            {
                id: 6,
                title: 'Chat Application',
                description: 'Real-time messaging application with user authentication',
                image: '💬',
                tags: ['Socket.io', 'Node.js', 'React'],
                link: '#'
            }
        ];
    }

    setupFilterButtons() {
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;

        // Get unique technologies
        const technologies = ['All', ...new Set(this.allProjects.flatMap(p => p.tags))];

        // Create filter buttons
        technologies.forEach(tech => {
            const button = document.createElement('button');
            button.className = `filter-btn ${tech === 'All' ? 'active' : ''}`;
            button.textContent = tech;
            button.addEventListener('click', () => this.filterProjects(tech));
            filterContainer.appendChild(button);
        });
    }

    filterProjects(technology) {
        this.currentFilter = technology;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === technology);
        });

        // Filter and display projects
        const filtered = technology === 'All'
            ? this.allProjects
            : this.allProjects.filter(p => p.tags.includes(technology));

        this.renderProjects(filtered);
    }

    renderProjects(projects) {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;

        grid.innerHTML = projects.map(project => `
            <div class="glass project-card">
                <div class="project-image">${project.image}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="project-link">View Project →</a>
            </div>
        `).join('');

        // Add animation
        grid.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease forwards`;
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// ============================================================
// Mobile Navigation
// ============================================================

class MobileNav {
    constructor() {
        this.init();
    }

    init() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }
}

// ============================================================
// Smooth Scroll Navigation
// ============================================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// ============================================================
// Lazy Load Images
// ============================================================

class LazyLoad {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('img[data-src]');
        if (!('IntersectionObserver' in window)) {
            images.forEach(img => img.src = img.dataset.src);
            return;
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    observer.unobserve(entry.target);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }
}

// ============================================================
// Scroll Animations
// ============================================================

class ScrollAnimation {
    constructor() {
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// ============================================================
// Initialize Application
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new ThemeManager();
    new ProjectFilter();
    new MobileNav();
    new SmoothScroll();
    new LazyLoad();
    new ScrollAnimation();

    // Optional: Log initialization
    console.log('Application initialized');
});

// ============================================================
// Utility Functions
// ============================================================

/**
 * Get element by ID
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * Get elements by class
 */
function getClass(className) {
    return document.querySelectorAll(`.${className}`);
}

/**
 * Get element by selector
 */
function getQuery(selector) {
    return document.querySelector(selector);
}

/**
 * Add event listener shortcut
 */
function listen(selector, event, callback) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (element) {
        element.addEventListener(event, callback);
    }
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
