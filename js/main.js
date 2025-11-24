// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header', 'partials/header.html');
    loadComponent('footer', 'partials/footer.html');
});

// Function to load HTML components
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            // Initialize any component-specific scripts
            if (elementId === 'header') {
                initializeNavigation();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// Initialize navigation functionality
function initializeNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '#')) {
            link.classList.add('active');
        }
    });
}

// Utility function for guide pages
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.guide-section');
    const nav = document.createElement('nav');
    nav.className = 'guide-navigation';
    
    sections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading) {
            const listItem = document.createElement('a');
            listItem.href = `#${section.id}`;
            listItem.textContent = heading.textContent;
            nav.appendChild(listItem);
        }
    });
    
    const guideContent = document.querySelector('.guide-content');
    if (guideContent) {
        guideContent.parentNode.insertBefore(nav, guideContent);
    }
}