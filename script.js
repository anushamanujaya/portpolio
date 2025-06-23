// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const words = ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Code Artist'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    const typingSpeed = isDeleting ? 100 : 150;
    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Form submission with Formspree integration
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(e.target);
    
    // Basic validation
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    try {
        // Send to Formspree
        const response = await fetch('https://formspree.io/f/xzzgagwo', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            e.target.reset();
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
        } else {
            throw new Error('Form submission failed');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Error state
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        // Show error message
        showNotification('Failed to send message. Please try again or contact me directly.', 'error');
    }
    
    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
    }, 3000);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
    
    // Add animation keyframes
    if (!document.querySelector('style[data-notification-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-styles', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Download CV function with error handling
function downloadCV() {
    try {
        const link = document.createElement('a');
        link.href = './documents/Anusha_Manujaya_CV.pdf';
        link.download = 'Anusha_Manujaya_CV.pdf';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('CV download started!', 'success');
    } catch (error) {
        console.error('Error downloading CV:', error);
        showNotification('Failed to download CV. Please try again.', 'error');
    }
}

// Debounce function for scroll events
function debounce(func, wait = 66, immediate = false) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Navbar scroll effect with debounce
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', debounce(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    // Auto-update active nav link based on scroll position
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    lastScrollY = currentScrollY;
}));

// Parallax effect for floating orbs with debounce
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    document.querySelector('.orb-1').style.transform = `translateY(${parallax}px) rotate(${scrolled * 0.1}deg)`;
    document.querySelector('.orb-2').style.transform = `translateY(${-parallax}px) rotate(${-scrolled * 0.1}deg)`;
    document.querySelector('.orb-3').style.transform = `translateY(${parallax * 0.8}px) rotate(${scrolled * 0.05}deg)`;
}));

// Hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Hover effects for skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(5deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Enhanced Certificate Modal functionality
const certificateCards = document.querySelectorAll('.certificate-card');
const modal = document.createElement('div');
modal.className = 'certificate-modal';

modal.innerHTML = `
    <div class="certificate-modal-content">
        <span class="close-modal">&times;</span>
        <img src="" alt="Certificate" class="certificate-modal-img">
    </div>
`;

document.body.appendChild(modal);

certificateCards.forEach(card => {
    const viewBtn = card.querySelector('.view-certificate-btn');
    const imgSrc = card.querySelector('.certificate-image').src;
    
    viewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.querySelector('.certificate-modal-img').src = imgSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Cursor following effect
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// Loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const loaderContent = document.createElement('div');
    loaderContent.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 3px solid rgba(0, 212, 255, 0.3); border-top: 3px solid #00d4ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: var(--text-primary); font-weight: 500;">Loading Portfolio...</p>
        </div>
    `;
    
    const spinKeyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = spinKeyframes;
    document.head.appendChild(style);
    
    loader.appendChild(loaderContent);
    document.body.appendChild(loader);
    
    // Hide loader after a short delay
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1500);
});

// Smooth reveal animations for elements
const revealElements = document.querySelectorAll('.project-card, .skill-item, .contact-item, .certificate-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

// View All Projects button functionality
document.querySelector('#projects .btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    // Add your logic here - could be:
    // - Redirect to a projects page
    // - Show more projects in a modal
    // - Expand the current section
    console.log('View All Projects clicked');
    showNotification('Redirecting to full projects page...', 'info');
});

// GitHub Profile button already works via href

// View All Certificates button functionality
document.querySelector('#certificates .btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    // Add your logic here
    console.log('View All Certificates clicked');
    showNotification('Showing all certificates...', 'info');
});

// Download Certificates button functionality
document.querySelector('#certificates .btn-secondary').addEventListener('click', (e) => {
    e.preventDefault();
    // Add your logic here - could be:
    // - Download a zip of certificates
    // - Open a modal with download options
    console.log('Download Certificates clicked');
    showNotification('Preparing certificates for download...', 'info');
});

// Particle effect on button hover
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                animation: particle-${i} 0.6s ease-out forwards;
            `;
            
            const keyframes = `
                @keyframes particle-${i} {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(0);
                    }
                }
            `;
            
            if (!document.querySelector(`style[data-particle="${i}"]`)) {
                const style = document.createElement('style');
                style.setAttribute('data-particle', i);
                style.textContent = keyframes;
                document.head.appendChild(style);
            }
            
            this.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 600);
        }
    });
});

console.log('🚀 Portfolio loaded successfully!');
console.log('💙 Built with passion by Anusha Manujaya');