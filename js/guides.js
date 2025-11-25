// Load header and footer components and initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        await loadComponent('header', 'partials/header.html');
        await loadComponent('footer', 'partials/footer.html');
        
        initializeNavigation();
        initializePageSpecificFeatures();
        
        // Load guides.js functionality if on a guide page
        if (window.location.pathname.includes('/guides/')) {
            loadGuidesFeatures();
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Function to load HTML components
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById(elementId).innerHTML = data;
    } catch (error) {
        console.error('Error loading component:', error);
        // Fallback: Create basic header if loading fails
        if (elementId === 'header') {
            createFallbackHeader();
        }
    }
}

// Create fallback header if component loading fails
function createFallbackHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <header>
            <div class="container">
                <div class="header-content">
                    <div class="logo">
                        <a href="index.html" style="color: white; text-decoration: none;">WebDev Guides</a>
                    </div>
                    <nav>
                        <ul>
                            // <li><a href="index.html">Home</a></li>
                            // <li><a href="guides/ecommerce.html">E-commerce</a></li>
                            // <li><a href="guides/blog.html">Blog</a></li>
                            // <li><a href="guides/portfolio.html">Portfolio</a></li>
                            // <li><a href="guides/corporate.html">Corporate</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;
}

// Initialize navigation functionality
function initializeNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === 'index.html' && linkPage === 'index.html') ||
            (currentPage.includes('guide') && linkPage.includes(currentPage.replace('.html', '')))) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.display = 'none';

    const nav = document.querySelector('nav');
    if (nav) {
        nav.parentNode.insertBefore(menuToggle, nav);
        
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Hide menu when clicking on a link (mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }

    // Handle responsive menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav?.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Initialize page-specific features
function initializePageSpecificFeatures() {
    // Home page features
    if (document.getElementById('categories')) {
        initializeCategoryInteractions();
    }

    // Add smooth scrolling for all anchor links
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

    // Add loading animation
    addLoadingAnimation();
}

// Initialize category page interactions
function initializeCategoryInteractions() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Add click animation
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                const link = card.querySelector('a.btn');
                if (link) {
                    link.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        link.style.transform = 'scale(1)';
                    }, 150);
                }
            }
        });
    });
}

// Load guides-specific features
function loadGuidesFeatures() {
    // Load guides.js dynamically
    const script = document.createElement('script');
    script.src = '../js/guides.js';
    script.onload = () => {
        console.log('Guides features loaded');
        // Initialize guides manager
        if (typeof GuidesManager !== 'undefined') {
            new GuidesManager();
        }
    };
    script.onerror = () => {
        console.error('Failed to load guides.js');
        // Fallback: add basic guide functionality
        addBasicGuideFeatures();
    };
    document.head.appendChild(script);
}

// Basic guide features fallback
function addBasicGuideFeatures() {
    // Add copy functionality to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code: ', err);
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
}

// Add loading animation
function addLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0;
            transition: opacity 0.3s ease-in;
        }
        .loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Add loaded class when page is ready
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Utility function for making API calls (if needed in future)
async function makeApiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp, makeApiCall };
}