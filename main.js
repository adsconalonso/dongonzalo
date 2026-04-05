/* ==========================================================================
   DON GONZALO - GLOBAL LOGIC (LUXE INTERACTION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Custom Cursor Logic (Desktop Only)
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const triggers = document.querySelectorAll('.cursor-trigger, a, button, .js-tilt');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; 
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const renderCursor = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 3. Magnetic Buttons
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Parallax Scroll & Navbar Dynamics
    const navbar = document.getElementById('navbar');
    const heroMedia = document.getElementById('hero-media');
    const heroMask = document.getElementById('hero-mask');
    const parallaxImages = document.querySelectorAll('.js-parallax');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Hero Mask Scale Effect (Specific for home/main pages)
        if (heroMask && scrollY < window.innerHeight * 1.5) {
            const scale = 1 + (scrollY / 100);
            heroMask.style.transform = `scale(${scale})`;
            if (heroMedia) heroMedia.style.transform = `scale(${1 + scrollY * 0.0005})`;
        }

        // Global Parallax for images
        parallaxImages.forEach(img => {
            const speed = img.getAttribute('data-speed') || 0.1;
            const parent = img.parentElement;
            const rect = parent.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translateY(${yPos}px)`;
            }
        });

        // Navbar Background Logic
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.remove('py-8');
                navbar.classList.add('py-4', 'bg-theme-bg/80', 'backdrop-blur-md', 'text-theme-text');
                navbar.classList.remove('mix-blend-difference');
            } else {
                navbar.classList.add('py-8', 'mix-blend-difference');
                navbar.classList.remove('py-4', 'bg-theme-bg/80', 'backdrop-blur-md', 'text-theme-text');
            }
        }
    });

    // 5. Reveal Observer (Entry animations)
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 6. Fullscreen Menu with Previews
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const menuPreviews = document.querySelectorAll('.menu-bg-preview');

    function toggleMenu(show) {
        if (!menuOverlay) return;
        if (show) {
            menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            menuOverlay.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('no-scroll');
        } else {
            menuOverlay.classList.add('opacity-0', 'pointer-events-none');
            menuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            document.body.classList.remove('no-scroll');
        }
    }

    if (openMenuBtn) openMenuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const bgId = link.getAttribute('data-bg');
            if (!bgId) return;
            menuPreviews.forEach(p => p.classList.add('opacity-0'));
            const targetBg = document.getElementById(bgId);
            if (targetBg) targetBg.classList.remove('opacity-0', 'opacity-30');
            if (targetBg) targetBg.classList.add('opacity-30');
        });
        link.addEventListener('mouseleave', () => {
            menuPreviews.forEach(p => p.classList.add('opacity-0'));
        });
        link.addEventListener('click', () => toggleMenu(false));
    });

    // 7. Shopping Cart Drawer System
    const cartDrawer = document.getElementById('cart-drawer');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartTriggers = document.querySelectorAll('.cart-trigger');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartToShopBtn = document.getElementById('cart-to-shop-btn');

    function toggleCart(show) {
        if (!cartDrawer) return;
        if (show) {
            cartDrawer.classList.remove('translate-x-full');
            if (cartBackdrop) {
                cartBackdrop.classList.remove('opacity-0', 'pointer-events-none');
                cartBackdrop.classList.add('opacity-100', 'pointer-events-auto');
            }
            document.body.classList.add('no-scroll');
        } else {
            cartDrawer.classList.add('translate-x-full');
            if (cartBackdrop) {
                cartBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
                cartBackdrop.classList.add('opacity-0', 'pointer-events-none');
            }
            document.body.classList.remove('no-scroll');
        }
    }

    cartTriggers.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart(true);
    }));

    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => toggleCart(false));
    if (cartToShopBtn) cartToShopBtn.addEventListener('click', () => {
        toggleCart(false);
        window.location.href = 'coleccion.html';
    });

    // 8. 3D Tilt Effect System
    const tiltCards = document.querySelectorAll('.js-tilt');
    tiltCards.forEach(card => {
        const inner = card.querySelector('.js-tilt-inner') || card;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const multiplier = 20; 
            const xRotate = multiplier * ((x - rect.width / 2) / rect.width);
            const yRotate = -multiplier * ((y - rect.height / 2) / rect.height);
            inner.style.transform = `perspective(1000px) rotateX(${yRotate}deg) rotateY(${xRotate}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});
