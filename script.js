// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Intersection Observer for subtle opacity animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for subtle animation
    const animateElements = document.querySelectorAll('.benefit-card, .product-card, .testimonial-card, .pricing-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 1;
            const yPos = -(scrolled * speed * 0.3);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
        });
    });

    // Add CSS for subtle animations
    const style = document.createElement('style');
    style.textContent = `
        .benefit-card, .product-card, .testimonial-card, .pricing-card {
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .fade-in {
            opacity: 1;
        }
        
        .main-nav.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            gap: 15px;
            border-top: 1px solid var(--glass-border);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Counter animation for stats
    function animateCounter(element, target, duration = 1000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    if (number && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, number);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    const ctaSection = document.querySelector('.cta-section');
    
    if (heroSection) statsObserver.observe(heroSection);
    if (ctaSection) statsObserver.observe(ctaSection);

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-primary[href="#order"]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            this.style.pointerEvents = 'none';
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
                this.style.background = '#4CAF50';
                
                // Show success message
                showNotification('Product added to cart successfully!', 'success');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                    this.style.pointerEvents = '';
                }, 2000);
            }, 1000);
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification styles
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--glass-bg);
                backdrop-filter: var(--glass-backdrop);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 16px 20px;
                color: var(--text-color);
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification i {
                color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
                font-size: 1.2rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted-color);
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: var(--text-color);
            }
        `;
        document.head.appendChild(notificationStyle);
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }

    // Form handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Add loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Close modal on backdrop click
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeModal();
                    }
                });
                
                // Close modal on escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                    }
                });
                
                const closeModal = () => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                };
                
                // Close button functionality
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', closeModal);
                }
            }
        });
    });

    // Smooth reveal animations for sections
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    // Observe sections for reveal
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // Add reveal animation styles
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        section {
            opacity: 0.8;
            transition: opacity 0.4s ease;
        }
        
        section.revealed {
            opacity: 1;
        }
    `;
    document.head.appendChild(revealStyle);

    // Debounce function for performance
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

    // Optimized scroll handler
    const optimizedScrollHandler = debounce(function() {
        // Any scroll-based animations can go here
    }, 16);

    window.addEventListener('scroll', optimizedScrollHandler);
});

// Add loading animation for page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyles);
}); 