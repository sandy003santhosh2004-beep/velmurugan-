/* =============================================
   VELMURUGAN OIL SHOP — SPA Router & Features
   ============================================= */

// Paste your deployed Google Apps Script Web App URL below
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlQDL8Ey6VyjfZy8wmGldJr-UiTp9hnxWoqGQHNTczJ0-DhiMaGw3nGcWTquu5Cl787A/exec"; 

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initPageRouter();
    initProductFilter();
    initZomatoCart();
    initFormOrderItems();
    initContactForm();
    initCounterAnimation();
    initHeroParallax();
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

        // If clicking an order button on a product card, pre-populate contact details
        if (trigger.classList.contains('product-btn')) {
            const product = trigger.dataset.product;
            const size = trigger.dataset.selectedSize;
            const price = trigger.dataset.selectedPrice;
            if (product && size) {
                const formMessage = document.getElementById('form-message');
                if (formMessage) {
                    formMessage.value = `Hi Velmurugan Oil Shop, I would like to order: ${product} (${size} for ${price}). Please contact me to process this order.`;
                }
            }
        }

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

    // Already active — do nothing (only on animated routing clicks)
    if (animate && targetPage.classList.contains('active')) return;

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

        // Check if cart is empty
        let totalItems = 0;
        for (const key in cartState) {
            totalItems += cartState[key].qty;
        }
        if (totalItems === 0) {
            alert("Please add at least one oil option to your order.");
            return;
        }

        submitBtn.innerHTML = '<span>Sending Order...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';

        setTimeout(() => {
            const name    = document.getElementById('form-name').value;
            const phone   = document.getElementById('form-phone').value;
            const orderMsg = generateCartMessage(false);

            // Log order to Google Sheets in background if web app URL is configured
            if (GOOGLE_SHEET_SCRIPT_URL) {
                const payload = {
                    name: name,
                    phone: phone,
                    orderList: orderMsg,
                    total: getCartTotalFormatted()
                };
                fetch(GOOGLE_SHEET_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.error('Google Sheets background log failed:', err));
            }

            submitBtn.innerHTML = '<span>✅ Order Placed!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #2D5016, #1A3B2B)';

            const waMsg = encodeURIComponent(
                `Hi Velmurugan Oil Shop!\n\nName: ${name}\nPhone: ${phone}\n\n${generateCartMessage(true)}`
            );

            setTimeout(() => {
                window.open(`https://wa.me/917010872398?text=${waMsg}`, '_blank');
            }, 400);

            setTimeout(() => {
                // Clear cart state
                for (const key in cartState) {
                    delete cartState[key];
                }
                updateCartBar();

                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 1200);
    });
}

/* =============================================
   HERO PARALLAX INTERACTION
   ============================================= */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const bottle = document.querySelector('.hero-oil-bottle');
    const floaters = document.querySelectorAll('.floating-element');

    if (!hero || !bottle) return;

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const rect = hero.getBoundingClientRect();
        const xVal = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const yVal = (clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Shift bottle slightly
        bottle.style.transform = `translate(-50%, -50%) translate(${xVal * 12}px, ${yVal * 12}px) rotate(${xVal * 1.5}deg)`;

        // Shift floating elements in relative directions
        floaters.forEach((el, index) => {
            const speed = (index + 1) * 8;
            el.style.transform = `translate(${xVal * -speed}px, ${yVal * -speed}px) rotate(${xVal * 4}deg)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        bottle.style.transform = `translate(-50%, -50%) translate(0, 0) rotate(0deg)`;
        floaters.forEach(el => {
            el.style.transform = `translate(0, 0) rotate(0deg)`;
        });
    });
}

/* =============================================
   PRODUCT ZOMATO CART FLOW
   ============================================= */
const cartState = {};

function initZomatoCart() {
    const variantItems = document.querySelectorAll('.variant-item');
    if (!variantItems.length) return;

    variantItems.forEach(item => {
        const btnAdd = item.querySelector('.btn-add');
        const qtyCounter = item.querySelector('.qty-counter');
        const qtyNumber = item.querySelector('.qty-number');
        const btnMinus = item.querySelector('.btn-minus');
        const btnPlus = item.querySelector('.btn-plus');

        const product = item.dataset.product;
        const size = item.dataset.size;
        const price = parseInt(item.dataset.price, 10);
        const itemKey = `${product} (${size})`;

        function updateItemUI(qty) {
            if (qty > 0) {
                btnAdd.style.display = 'none';
                qtyCounter.style.display = 'flex';
                qtyNumber.textContent = qty;
            } else {
                btnAdd.style.display = 'block';
                qtyCounter.style.display = 'none';
                qtyNumber.textContent = 0;
            }
        }

        btnAdd.addEventListener('click', () => {
            cartState[itemKey] = { product, size, price, qty: 1 };
            updateItemUI(1);
            updateCartBar();
        });

        btnPlus.addEventListener('click', () => {
            if (!cartState[itemKey]) {
                cartState[itemKey] = { product, size, price, qty: 0 };
            }
            cartState[itemKey].qty += 1;
            updateItemUI(cartState[itemKey].qty);
            updateCartBar();
        });

        btnMinus.addEventListener('click', () => {
            if (cartState[itemKey] && cartState[itemKey].qty > 0) {
                cartState[itemKey].qty -= 1;
                updateItemUI(cartState[itemKey].qty);
                if (cartState[itemKey].qty === 0) {
                    delete cartState[itemKey];
                }
                updateCartBar();
            }
        });
    });

    // Handle Floating Cart Bar Checkout integrations
    const whatsappBtn = document.getElementById('cart-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const nameField = document.getElementById('form-name');
            const phoneField = document.getElementById('form-phone');

            if (!nameField || !phoneField) return;

            if (!nameField.value.trim() || !phoneField.value.trim()) {
                // Scroll to contact form
                navigateTo('order');
                setTimeout(() => {
                    nameField.focus();
                    nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Visual warning highlights
                    nameField.style.borderColor = 'var(--color-accent)';
                    phoneField.style.borderColor = 'var(--color-accent)';
                    
                    // Reset highlights after 3s
                    setTimeout(() => {
                        nameField.style.borderColor = '';
                        phoneField.style.borderColor = '';
                    }, 3000);
                }, 300);
                return;
            }

            // Submit the form programmatically (runs Google Sheets logging + WhatsApp launch)
            const form = document.getElementById('contact-form');
            if (form) {
                form.requestSubmit();
            }
        });
    }

    // Toggle cart preview popover only on chevron click
    const cartChevron = document.getElementById('cart-chevron');
    const cartPopover = document.getElementById('cart-preview-popover');
    const cartClose = document.getElementById('cart-preview-close');
    
    if (cartChevron && cartPopover) {
        cartChevron.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = cartPopover.style.display === 'flex';
            cartPopover.style.display = isOpen ? 'none' : 'flex';
            cartChevron.classList.toggle('open', !isOpen);
            cartChevron.innerHTML = isOpen ? 'Items ▲' : 'Items ▼';
        });
        
        if (cartClose) {
            cartClose.addEventListener('click', (e) => {
                e.stopPropagation();
                cartPopover.style.display = 'none';
                cartChevron.classList.remove('open');
                cartChevron.innerHTML = 'Items ▲';
            });
        }
        
        // Close popover when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartPopover.contains(e.target) && e.target !== cartChevron && !cartChevron.contains(e.target)) {
                cartPopover.style.display = 'none';
                cartChevron.classList.remove('open');
                cartChevron.innerHTML = 'Items ▲';
            }
        });
    }
}

function updateCartBar() {
    const bar = document.getElementById('floating-cart-bar');
    if (!bar) return;
    const countEl = bar.querySelector('.cart-count');
    const totalEl = bar.querySelector('.cart-total');

    let totalItems = 0;
    let totalPrice = 0;

    for (const key in cartState) {
        totalItems += cartState[key].qty;
        totalPrice += cartState[key].qty * cartState[key].price;
    }

    if (totalItems > 0) {
        if (countEl) countEl.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''} added`;
        if (totalEl) totalEl.textContent = `Total: ₹${totalPrice.toLocaleString()}`;
        bar.classList.add('active');
    } else {
        bar.classList.remove('active');
        const cartPopover = document.getElementById('cart-preview-popover');
        if (cartPopover) {
            cartPopover.style.display = 'none';
            const cartChevron = document.getElementById('cart-chevron');
            if (cartChevron) {
                cartChevron.classList.remove('open');
                cartChevron.innerHTML = 'Items ▲';
            }
        }
    }

    // Update preview popover list
    const cppList = document.getElementById('cpp-items-list');
    if (cppList) {
        cppList.innerHTML = '';
        for (const key in cartState) {
            const item = cartState[key];
            const div = document.createElement('div');
            div.className = 'cpp-item';
            div.innerHTML = `
                <span class="cpp-item-name">${item.product} (${item.size}) x ${item.qty}</span>
                <span class="cpp-item-price">₹${(item.qty * item.price).toLocaleString()}</span>
            `;
            cppList.appendChild(div);
        }
    }

    // Update synchronization across both pages
    updateFormOrderItemsUI();
    updateCatalogQuantitiesUI();
}

function generateCartMessage(isWhatsApp = false) {
    let msg = isWhatsApp 
        ? "Hi Velmurugan Oil Shop! I would like to place an order for the following cold-pressed oils:\n\n"
        : "Hi Velmurugan Oil Shop, I would like to place an order for:\n\n";

    let totalPrice = 0;
    for (const key in cartState) {
        const item = cartState[key];
        msg += `• ${item.product} (${item.size}) x ${item.qty} — ₹${(item.qty * item.price).toLocaleString()}\n`;
        totalPrice += item.qty * item.price;
    }

    msg += `\nTotal Amount: ₹${totalPrice.toLocaleString()}`;
    return msg;
}

function getCartTotalFormatted() {
    let totalPrice = 0;
    for (const key in cartState) {
        totalPrice += cartState[key].qty * cartState[key].price;
    }
    return totalPrice > 0 ? `₹${totalPrice.toLocaleString()}` : "N/A";
}

/* =============================================
   FORM ORDER ITEMS SYNCHRONIZATION
   ============================================= */
function initFormOrderItems() {
    const formItems = document.querySelectorAll('.form-order-item');
    if (!formItems.length) return;

    formItems.forEach(item => {
        const product = item.dataset.product;
        const select = item.querySelector('.foi-size-select');
        const btnAdd = item.querySelector('.btn-add');
        const btnMinus = item.querySelector('.btn-minus');
        const btnPlus = item.querySelector('.btn-plus');

        function getSelectedItemDetails() {
            const selectedOption = select.options[select.selectedIndex];
            const size = selectedOption.value;
            const price = parseInt(selectedOption.dataset.price, 10);
            const itemKey = `${product} (${size})`;
            return { size, price, itemKey };
        }

        // Change quantity when variant size selector dropdown is changed
        select.addEventListener('change', () => {
            updateFormOrderItemsUI();
        });

        btnAdd.addEventListener('click', () => {
            const { size, price, itemKey } = getSelectedItemDetails();
            cartState[itemKey] = { product, size, price, qty: 1 };
            updateCartBar();
        });

        btnPlus.addEventListener('click', () => {
            const { size, price, itemKey } = getSelectedItemDetails();
            if (!cartState[itemKey]) {
                cartState[itemKey] = { product, size, price, qty: 0 };
            }
            cartState[itemKey].qty += 1;
            updateCartBar();
        });

        btnMinus.addEventListener('click', () => {
            const { size, itemKey } = getSelectedItemDetails();
            if (cartState[itemKey] && cartState[itemKey].qty > 0) {
                cartState[itemKey].qty -= 1;
                if (cartState[itemKey].qty === 0) {
                    delete cartState[itemKey];
                }
                updateCartBar();
            }
        });
    });
}

function updateFormOrderItemsUI() {
    const formItems = document.querySelectorAll('.form-order-item');
    let totalPrice = 0;
    
    for (const key in cartState) {
        totalPrice += cartState[key].qty * cartState[key].price;
    }
    
    const totalValEl = document.getElementById('form-order-total-val');
    if (totalValEl) {
        totalValEl.textContent = `₹${totalPrice.toLocaleString()}`;
    }

    formItems.forEach(item => {
        const product = item.dataset.product;
        const select = item.querySelector('.foi-size-select');
        if (!select) return;
        
        const selectedOption = select.options[select.selectedIndex];
        const size = selectedOption.value;
        const itemKey = `${product} (${size})`;
        
        const qty = (cartState[itemKey] && cartState[itemKey].qty) || 0;
        
        const btnAdd = item.querySelector('.btn-add');
        const qtyCounter = item.querySelector('.qty-counter');
        const qtyNumber = item.querySelector('.qty-number');
        
        if (qty > 0) {
            if (btnAdd) btnAdd.style.display = 'none';
            if (qtyCounter) qtyCounter.style.display = 'flex';
            if (qtyNumber) qtyNumber.textContent = qty;
        } else {
            if (btnAdd) btnAdd.style.display = 'block';
            if (qtyCounter) qtyCounter.style.display = 'none';
            if (qtyNumber) qtyNumber.textContent = 0;
        }
    });
}

function updateCatalogQuantitiesUI() {
    const variantItems = document.querySelectorAll('.variant-item');
    variantItems.forEach(item => {
        const btnAdd = item.querySelector('.btn-add');
        const qtyCounter = item.querySelector('.qty-counter');
        const qtyNumber = item.querySelector('.qty-number');
        
        const product = item.dataset.product;
        const size = item.dataset.size;
        const itemKey = `${product} (${size})`;
        
        const qty = (cartState[itemKey] && cartState[itemKey].qty) || 0;
        
        if (qty > 0) {
            if (btnAdd) btnAdd.style.display = 'none';
            if (qtyCounter) qtyCounter.style.display = 'flex';
            if (qtyNumber) qtyNumber.textContent = qty;
        } else {
            if (btnAdd) btnAdd.style.display = 'block';
            if (qtyCounter) qtyCounter.style.display = 'none';
            if (qtyNumber) qtyNumber.textContent = 0;
        }
    });
}

