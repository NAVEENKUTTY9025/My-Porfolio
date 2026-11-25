/* ==========================================================================
   Naveen Kumar S — Shared Portfolio Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const rtlToggle = document.getElementById('rtlToggle');

    // Set current year in footer
    document.querySelectorAll('.current-year').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    // Apply saved theme & direction
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDir = localStorage.getItem('dir') || 'ltr';
    body.setAttribute('data-theme', savedTheme);
    body.setAttribute('dir', savedDir);
    updateThemeUI(savedTheme);
    updateDirUI(savedDir);

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeUI(nextTheme);
        });
    }

    // RTL/LTR Toggle
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const nextDir = body.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
            body.setAttribute('dir', nextDir);
            localStorage.setItem('dir', nextDir);
            updateDirUI(nextDir);
            closeMobileMenu();
        });
    }

    function updateThemeUI(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        const tooltip = themeToggle.querySelector('.tooltip');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (tooltip) tooltip.textContent = theme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
        themeToggle.classList.toggle('active', theme === 'dark');
    }

    function updateDirUI(dir) {
        if (!rtlToggle) return;
        const icon = rtlToggle.querySelector('i');
        const tooltip = rtlToggle.querySelector('.tooltip');
        if (icon) icon.className = dir === 'rtl' ? 'fas fa-align-left' : 'fas fa-exchange-alt';
        if (tooltip) tooltip.textContent = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
        rtlToggle.classList.toggle('active', dir === 'rtl');
    }

    // Mobile Menu Controls
    function openMobileMenu() {
        if (!navMenu || !menuOverlay || !hamburger) return;
        navMenu.classList.add('active');
        menuOverlay.classList.add('active');
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
        body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        if (!navMenu || !menuOverlay || !hamburger) return;
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        body.classList.remove('menu-open');
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMobileMenu();
    });

    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Scroll Reveal Animations
    const fadeItems = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );
        fadeItems.forEach((el) => revealObserver.observe(el));
    } else {
        fadeItems.forEach((el) => el.classList.add('visible'));
    }

    // Animate Skill Progress Bars
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');
    if (skillBars.length > 0) {
        const fillBars = () => {
            skillBars.forEach((bar) => {
                bar.style.width = `${bar.getAttribute('data-width')}%`;
            });
        };
        if ('IntersectionObserver' in window) {
            const barObserver = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const bar = entry.target;
                            bar.style.width = `${bar.getAttribute('data-width')}%`;
                            obs.unobserve(bar);
                        }
                    });
                },
                { threshold: 0.2 }
            );
            skillBars.forEach((bar) => barObserver.observe(bar));
        } else {
            fillBars();
        }
    }

    // Portfolio Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                filterButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');

                portfolioItems.forEach((item) => {
                    const categories = (item.getAttribute('data-category') || '').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Portfolio Project Details Panel
    const viewButtons = document.querySelectorAll('.view-project[data-project]');
    const detailsContainer = document.getElementById('projectDetailsContainer');
    if (viewButtons.length > 0 && detailsContainer) {
        viewButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const projectId = btn.getAttribute('data-project');
                const template = document.getElementById(`${projectId}Template`);
                if (!template) return;

                detailsContainer.innerHTML = '';
                detailsContainer.appendChild(template.content.cloneNode(true));

                const closeBtn = detailsContainer.querySelector('.close-details');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        detailsContainer.innerHTML = '';
                    });
                }

                detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach((question) => {
        question.addEventListener('click', () => {
            const currentItem = question.closest('.faq-item');
            if (!currentItem) return;

            document.querySelectorAll('.faq-item').forEach((item) => {
                if (item !== currentItem) item.classList.remove('active');
            });
            currentItem.classList.toggle('active');
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !email || !message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }
            if (!isEmailValid) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            const mailtoSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : `[Portfolio Inquiry] from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            const mailtoLink = `mailto:naveenkumarli2020@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            showStatus(
                `Thank you, ${name}! Your message is ready. Opening your email client or you can email naveenkumarli2020@gmail.com directly.`,
                'success'
            );
            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }

    function showStatus(msg, type) {
        if (formStatus) {
            formStatus.textContent = msg;
            formStatus.className = `form-status ${type}`;
        } else {
            alert(msg);
        }
    }
});
