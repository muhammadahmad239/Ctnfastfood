// CtN FastFood - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupImageLoading();
    setupFormValidation();
    setupAnimations();
    
    // Page-specific initializations
    if (document.getElementById('cartItems')) {
        initializeOrderPage();
    }
    
    if (document.getElementById('contactForm')) {
        initializeContactForm();
    }
    
    console.log('CtN FastFood website initialized successfully!');
}

// Navigation Setup
function setupNavigation() {
    // Smooth scrolling for anchor links
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

    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile menu auto-close
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks2 = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks2.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.style.background = 'linear-gradient(135deg, #dc2626, #991b1b)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, #dc2626, #991b1b)';
                navbar.style.backdropFilter = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .stat-item, .location-info').forEach(el => {
        observer.observe(el);
    });
}

// Image Loading with Error Handling
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Fallback image or placeholder
            this.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
            this.alt = 'Food item placeholder';
        });
        
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    showToast('Please fill in all required fields correctly.', 'error');
                }
            }
            
            form.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

// Setup Animations
function setupAnimations() {
    // Add loading class to buttons when clicked
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    // Stagger animation for cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Order Page Initialization
function initializeOrderPage() {
    // Display cart immediately
    cartManager.displayCart();
    
    // Setup form validation
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('input', validateOrderForm);
    }
    
    // Setup quick add functionality
    setupQuickAdd();
}

// Quick Add Functionality
function setupQuickAdd() {
    const quickAddButtons = document.querySelectorAll('.quick-add-card .btn');
    
    quickAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add animation feedback
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = 'Add';
                this.disabled = false;
            }, 1500);
        });
    });
}

// Validate Order Form
function validateOrderForm() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    
    const isValid = name.length >= 2 && 
                   phone.length >= 10 && 
                   address.length >= 10;
    
    // You can add visual feedback here
    return isValid;
}

// Contact Form Initialization
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            // Simulate sending message
            showToast('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            setTimeout(() => {
                this.reset();
                this.classList.remove('was-validated');
            }, 1000);
        });
    }
}

// Enhanced Toast Function
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Get or Create Toast Container
function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    return container;
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Price formatter
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker Registration (if you want to add PWA features later)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for global access
window.CtNFastFood = {
    showToast,
    formatPrice,
    validateEmail,
    formatPhoneNumber
};