/* =============================================
   VELMURUGAN OIL SHOP — SPA Router & Features
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initPageRouter();
    initProductFilter();
    initContactForm();
    initCounterAnimation();
});

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 700);
        }, 1000);
    });

    // Fallback
    setTimeout(() => preloader.classList.add('hidden'), 3000);
}

/* =============================================
   NAVBAR — Glassmorphic Scroll Effect
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   SPA PAGE ROUTER
   ============================================= */
function initPageRouter() {
    // All clickable elements with [data-page]
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-page]');
        if (!trigger) return;

        e.preventDefault();
        const targetPage = trigger.dataset.page;
        if (targetPage) navigateTo(targetPage);
    });

    // Show home by default
    navigateTo('home', false);
}

function navigateTo(pageId, animate = true) {
    const allPages = document.querySelectorAll('.page-section');
    const targetPage = document.getElementById(`page-${pageId}`);
    const allNavLinks = document.querySelectorAll('.nav-link');

    if (!targetPage) return;

    // Already active — do nothing
    if (targetPage.classList.contains('active')) return;

    if (animate) {
        // Find and exit the current active page
        const currentPage = document.querySelector('.page-section.active');
        if (currentPage) {
            currentPage.classList.add('page-exit');
            setTimeout(() => {
                currentPage.classList.remove('active', 'page-exit');
                showPage(targetPage, allNavLinks, pageId);
            }, 220);
        } else {
            showPage(targetPage, allNavLinks, pageId);
        }
    } else {
        // No animation on first load
        allPages.forEach(p => p.classList.remove('active'));
        targetPage.classList.add('active');
        updateNavLinks(allNavLinks, pageId);
        triggerReveal(targetPage);
        // Run counters on home
        if (pageId === 'home') initCounterAnimation();
    }

    // Scroll page to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(targetPage, allNavLinks, pageId) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active', 'page-exit'));
    targetPage.classList.add('active');
    updateNavLinks(allNavLinks, pageId);

    // Re-trigger reveal animations
    triggerReveal(targetPage);

    // Run counters when visiting home
    if (pageId === 'home') initCounterAnimation();
}

function updateNavLinks(allNavLinks, pageId) {
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });
}

/* =============================================
   REVEAL ANIMATIONS
   ============================================= */
function triggerReveal(pageEl) {
    const elements = pageEl.querySelectorAll('.reveal');

    // Reset before animating
    elements.forEach(el => {
        el.classList.remove('revealed');
    });

    // Stagger reveal
    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, 80 + i * 60);
    });
}

/* =============================================
   PRODUCT FILTER
   ============================================= */
function initProductFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    if (!filterBtns.length || !productCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach((card, index) => {
                const category = card.dataset.category || '';
                const show = filter === 'all' || category.includes(filter);

                if (show) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 70);
                } else {
                    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    setTimeout(() => { card.style.display = 'none'; }, 260);
                }
            });
        });
    });
}

/* =============================================
   COUNTER ANIMATION (Hero Stats)
   ============================================= */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    counters.forEach(counter => {
        animateCounter(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 1800;
    const startTime = performance.now();

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        element.textContent = Math.floor(eased * target).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/* =============================================
   CONTACT FORM — WhatsApp Integration
   ============================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('form-submit');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';

        setTimeout(() => {
            const name    = document.getElementById('form-name').value;
            const phone   = document.getElementById('form-phone').value;
            const product = document.getElementById('form-product').value;
            const message = document.getElementById('form-message').value;

            submitBtn.innerHTML = '<span>✅ Message Sent!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #5A8F3C, #2D5016)';

            const waMsg = encodeURIComponent(
                `Hi Velmurugan Oil Shop!\n\nName: ${name}\nPhone: ${phone}\nProduct: ${product}\nMessage: ${message}`
            );

            setTimeout(() => {
                window.open(`https://wa.me/917010872398?text=${waMsg}`, '_blank');
            }, 400);

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 1200);
    });
}
