document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const loader = document.querySelector('.loader');
    const currentYearSpan = document.getElementById('current-year');

    // ---=== Loader ===--- //
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        // Optional: remove loader from DOM after transition
        setTimeout(() => {
          if(loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 500); // Reduced for quicker load, adjust as needed
    }

    // ---=== Update Current Year in Footer ===--- //
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ---=== Theme Toggle Functionality ===--- //
    function setTheme(mode) {
        if (mode === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        localStorage.setItem('theme', mode);
    }

    if (themeToggle && themeIcon) {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Set default theme: saved, then system, then light
        const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(defaultTheme); // Apply initially

        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
            setTheme(newTheme);
        });
    } else {
      // Fallback or ensure light theme if toggle not present
      if (!body.classList.contains('dark-theme') && !body.classList.contains('light-theme')) {
        body.classList.add('light-theme');
      }
    }


    // ---=== Mobile Navigation Toggle ===--- //
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
            body.classList.toggle('nav-open', isActive);
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    body.classList.remove('nav-open');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('nav-open');
            }
        });
    }


    // ---=== Smooth Scrolling for Anchor Links & Active Nav Link Highlighting ===--- //
    const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                // Update active link immediately for better UX
                updateActiveNavLink(targetId);
            }
        });
    });

    function updateActiveNavLink(activeSectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeSectionId) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function onScroll() {
        let currentSectionId = '#hero'; // Default to hero
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Add some offset
            if (window.scrollY >= sectionTop) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        updateActiveNavLink(currentSectionId);

        // Scroll to top button visibility
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial call to set active link


    // ---=== Scroll to Top Button Functionality ===--- //
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ---=== Intersection Observer for Section Animations ===--- //
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation if not needed again
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Initial animation for elements already in view (like hero elements)
    document.querySelectorAll('.fade-in-element, .slide-in-element, .scale-in-element').forEach(el => {
        // Check if already visible (e.g., hero section on load)
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            // A simple way to trigger animations for elements initially in viewport
            // Ensure they are not part of a '.section' already handled by IntersectionObserver
            // or let the IntersectionObserver handle them if they are.
            // This part might need refinement based on exact structure.
            // For now, let's assume sections handle their direct children.
        }
    });


    // ---=== Form Handling (Placeholders, Focus, Submission) ===--- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input[placeholder], textarea[placeholder]');

        formInputs.forEach(input => {
            const placeholderText = input.getAttribute('placeholder');
            if (placeholderText) { // Only if placeholder exists
                const label = input.previousElementSibling; // Assuming label is right before input
                if(label && label.tagName === 'LABEL'){
                    // Logic for floating labels can be added here if desired
                    // For now, we'll use the explicit labels
                }
            }
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                field.classList.remove('error'); // Clear previous errors
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.addEventListener('input', function() { this.classList.remove('error'); }, { once: true });
                }
            });

            if (!isValid) return;

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.classList.add('success');
                this.reset(); // Clear form fields
                requiredFields.forEach(field => field.classList.remove('has-value', 'error')); // Reset visual state

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 2500);
            }, 1500);
        });
    }


    // ---=== Typewriter Effect ===--- //
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const textContent = typewriterElement.textContent.trim(); // Get text from HTML
        const phrases = textContent.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (phrases.length > 0) {
            let currentPhraseIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            let typeSpeed = 120; // Slower for more comfy feel
            let pauseAtEnd = 2000; // Longer pause
            let pauseBetween = 500;

            function typeWriter() {
                const currentPhrase = phrases[currentPhraseIndex];
                let displayText = '';

                if (isDeleting) {
                    displayText = currentPhrase.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    typeSpeed = 60;
                } else {
                    displayText = currentPhrase.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                    typeSpeed = 120;
                }
                typewriterElement.textContent = displayText;

                if (!isDeleting && currentCharIndex === currentPhrase.length) {
                    isDeleting = true;
                    typeSpeed = pauseAtEnd;
                } else if (isDeleting && currentCharIndex === 0) {
                    isDeleting = false;
                    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                    typeSpeed = pauseBetween;
                }
                setTimeout(typeWriter, typeSpeed);
            }
            setTimeout(typeWriter, pauseBetween); // Initial start
        }
    }


    // ---=== Glitch Effect on Hover/Focus (Optional, can be CPU intensive) ===--- //
    const glitchElements = document.querySelectorAll('.glitch-text');
    if (glitchElements.length > 0) {
        glitchElements.forEach(element => {
            // Trigger on interval for subtle background effect
            setInterval(() => {
              if (Math.random() > 0.9) { // Lower probability for less frequent glitch
                element.classList.add('active-glitch');
                setTimeout(() => {
                  element.classList.remove('active-glitch');
                }, Math.random() * 200 + 100); // Random duration
              }
            }, 2000); // Longer interval
        });
    }


    // ---=== Tooltip Initialization (for ARIA) ===--- //
    const tooltips = document.querySelectorAll('.tooltip');
    if (tooltips.length > 0) {
        tooltips.forEach(tooltip => {
            const tooltipTextEl = tooltip.querySelector('.tooltip-text');
            if (tooltipTextEl) {
                const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
                tooltipTextEl.id = tooltipId;
                tooltip.setAttribute('aria-describedby', tooltipId);
                // No explicit role="tooltip" on the trigger, but on the tooltip text itself is better
            }
        });
    }


    // ---=== Accessibility: Keyboard Navigation Focus Outline ===--- //
    function handleFirstTab(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDown);
        }
    }
    function handleMouseDown() {
        document.body.classList.remove('keyboard-user');
        window.removeEventListener('mousedown', handleMouseDown);
        window.addEventListener('keydown', handleFirstTab);
    }
    window.addEventListener('keydown', handleFirstTab);

});