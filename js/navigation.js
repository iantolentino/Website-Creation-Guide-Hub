// Navigation functionality
class Navigation {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
    }
    
    handleScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(67, 97, 238, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
                header.style.backdropFilter = 'none';
            }
        });
    }
    
    handleMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const nav = document.querySelector('nav ul');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuBtn.classList.toggle('active');
            });
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});