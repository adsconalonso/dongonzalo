/* ==========================================================================
   DON GONZALO - GLOBAL LOGIC (LUXE INTERACTION)
   ========================================================================== */

// ==========================================
// 6. E-COMMERCE ENGINE & WOMPI
// ==========================================

let cart = JSON.parse(localStorage.getItem('dg_cart')) || [];
const WOMPI_PUBLIC_KEY = 'pub_prod_SBFnKY3HA8hAMK78beivLZWtdmcKGAEt';
const SHIPPING_FEE = 16000;
const FREE_SHIPPING_THRESHOLD = 150000;

function saveCart() {
    localStorage.setItem('dg_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    openCart();
    
    // Feedback visual
    showToast(translations[currentLang]['prod-added'] || 'Agregado a la mochila');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getShippingCost() {
    const subtotal = getCartSubtotal();
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_FEE;
}

function getCartTotal() {
    return getCartSubtotal() + getShippingCost();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function openCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.add('translate-x-full');
        document.body.style.overflow = '';
    }
}

function loadCartDrawer() {
    const holder = document.getElementById('cart-drawer-holder');
    if (!holder) return;

    holder.innerHTML = `
        <div id="cart-drawer" class="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#F5F2ED] z-[1100] transform translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] shadow-2xl flex flex-col">
            <div class="p-8 border-b border-[#1A1412]/5 flex justify-between items-center bg-[#1A1412]/5">
                <div class="flex items-center gap-4">
                    <i data-lucide="shopping-bag" class="w-5 h-5 text-[#8C4A23]"></i>
                    <h2 class="uppercase tracking-[0.3em] text-xs font-bold" data-i18n="nav-menu">Tu Mochila</h2>
                </div>
                <button id="close-cart" class="p-2 hover:bg-[#1A1412]/5 rounded-full transition-colors cursor-trigger">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto px-8 py-4 hide-scrollbar">
                <div id="cart-empty" class="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 hidden">
                    <div class="w-24 h-24 bg-[#1A1412]/5 rounded-full flex items-center justify-center text-[#1A1412]/10">
                        <i data-lucide="coffee" class="w-12 h-12"></i>
                    </div>
                    <div>
                        <p class="text-xl font-serif italic mb-4" data-i18n="cart-empty">Tu mochila está vacía</p>
                        <a href="coleccion.html" class="uppercase tracking-widest text-[10px] font-bold text-[#8C4A23] border-b border-[#8C4A23] pb-1 cursor-trigger">Ir a la tienda</a>
                    </div>
                </div>
                <div id="cart-full">
                    <div id="cart-items-container" class="space-y-2 mb-12"></div>
                    <div class="pt-12 border-t border-[#1A1412]/10 space-y-8">
                        <span class="uppercase tracking-widest text-[10px] font-bold text-[#8C4A23] block" data-i18n="cart-shipping-title">Datos de Envío</span>
                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2"><label class="text-[10px] uppercase tracking-widest opacity-40 font-bold" data-i18n="cart-name">Nombre Completo</label><input type="text" id="ship-name" class="w-full bg-[#1A1412]/5 border-b border-[#1A1412]/10 py-3 px-4 outline-none focus:border-[#8C4A23] transition-colors font-light text-sm"></div>
                            <div class="space-y-2"><label class="text-[10px] uppercase tracking-widest opacity-40 font-bold" data-i18n="cart-address">Dirección de Entrega</label><input type="text" id="ship-address" class="w-full bg-[#1A1412]/5 border-b border-[#1A1412]/10 py-3 px-4 outline-none focus:border-[#8C4A23] transition-colors font-light text-sm"></div>
                            <div class="grid grid-cols-2 gap-6">
                                <div class="space-y-2"><label class="text-[10px] uppercase tracking-widest opacity-40 font-bold" data-i18n="cart-city">Ciudad</label><input type="text" id="ship-city" value="Medellín" class="w-full bg-[#1A1412]/5 border-b border-[#1A1412]/10 py-3 px-4 outline-none focus:border-[#8C4A23] transition-colors font-light text-sm"></div>
                                <div class="space-y-2"><label class="text-[10px] uppercase tracking-widest opacity-40 font-bold" data-i18n="cart-phone">Celular</label><input type="tel" id="ship-phone" class="w-full bg-[#1A1412]/5 border-b border-[#1A1412]/10 py-3 px-4 outline-none focus:border-[#8C4A23] transition-colors font-light text-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="cart-footer" class="p-8 bg-[#F5F2ED] border-t border-[#1A1412]/5 space-y-6">
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-xs opacity-60">
                        <span data-i18n="cart-subtotal">Subtotal</span>
                        <span id="cart-subtotal">$0</span>
                    </div>
                    <div class="flex justify-between items-center text-xs opacity-60">
                        <span data-i18n="cart-shipping-cost">Envío</span>
                        <span id="cart-shipping">$0</span>
                    </div>
                    <div id="free-shipping-teaser" class="text-[10px] text-theme-accent font-bold italic pt-2"></div>
                    <div class="flex justify-between items-end pt-4 border-t border-theme-text/5">
                        <span class="uppercase tracking-widest text-[10px] font-bold opacity-40" data-i18n="cart-total-label">Total</span>
                        <span id="cart-total" class="text-3xl font-serif italic">$0</span>
                    </div>
                </div>
                <button id="checkout-btn" class="w-full py-6 bg-[#1A1412] text-[#F5F2ED] uppercase tracking-widest font-bold text-xs hover:bg-[#8C4A23] transition-all duration-500 shadow-xl flex items-center justify-center gap-4 cursor-trigger group">
                    <span data-i18n="cart-pay">Finalizar y Pagar</span> <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-2 transition-transform"></i>
                </button>
                <p class="text-[9px] text-center opacity-30 uppercase tracking-widest leading-loose" data-i18n="cart-footer-note">Pagos seguros procesados por <span class="font-bold">Wompi</span>. Tiempos de entrega: 1-3 días hábiles.</p>
            </div>
        </div>
    `;

    renderCart();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
    document.getElementById('checkout-btn')?.addEventListener('click', initWompiCheckout);

    // Cargar script de Wompi si no existe
    if (!document.querySelector('script[src*="wompi"]')) {
        const script = document.createElement('script');
        script.src = "https://checkout.wompi.co/widget.js";
        document.head.appendChild(script);
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty');
    const fullState = document.getElementById('cart-full');
    const totalElement = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        emptyState?.classList.remove('hidden');
        fullState?.classList.add('hidden');
    } else {
        emptyState?.classList.add('hidden');
        fullState?.classList.remove('hidden');
        
        container.innerHTML = cart.map(item => `
            <div class="flex gap-6 items-center py-6 border-b border-theme-text/5 group">
                <div class="w-20 h-24 bg-theme-surface overflow-hidden shadow-md">
                    <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                </div>
                <div class="flex-1">
                    <h4 class="font-serif italic text-lg leading-tight">${item.name}</h4>
                    <div class="flex justify-between items-center mt-4">
                        <div class="flex items-center gap-4 border border-theme-text/10 px-3 py-1">
                            <button onclick="updateQuantity('${item.id}', -1)" class="text-xs hover:text-theme-accent transition-colors">-</button>
                            <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="text-xs hover:text-theme-accent transition-colors">+</button>
                        </div>
                        <span class="font-bold text-sm">$${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        
        if (totalElement) {
            const subtotal = getCartSubtotal();
            const shipping = getShippingCost();
            const total = getCartTotal();

            document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString()}`;
            document.getElementById('cart-shipping').textContent = shipping === 0 ? (subtotal > 0 ? 'Gratis' : '$0') : `$${shipping.toLocaleString()}`;
            totalElement.textContent = `$${total.toLocaleString()}`;

            const teaser = document.getElementById('free-shipping-teaser');
            if (teaser) {
                if (subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD) {
                    const missing = FREE_SHIPPING_THRESHOLD - subtotal;
                    teaser.textContent = `¡Faltan $${missing.toLocaleString()} para envío GRATIS!`;
                    teaser.classList.remove('hidden');
                } else {
                    teaser.classList.add('hidden');
                }
            }
        }
        
        // Re-init lucide icons for dynamic content
        lucide.createIcons();
    }
    updateCartBadge();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-theme-text text-theme-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] z-[1000] shadow-2xl reveal';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 7. WOMPI CHECKOUT TRIGGER
function initWompiCheckout() {
    if (cart.length === 0) return;

    const total = getCartTotal();
    const reference = `DG-${Date.now()}`;
    
    // Aquí podrías guardar los datos del formulario de envío antes de abrir Wompi
    const shippingData = {
        name: document.getElementById('ship-name')?.value,
        address: document.getElementById('ship-address')?.value,
        phone: document.getElementById('ship-phone')?.value,
        city: document.getElementById('ship-city')?.value
    };

    if (!shippingData.name || !shippingData.address || !shippingData.phone) {
        alert('Por favor completa los datos de envío');
        return;
    }

    var checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: total * 100,
        reference: reference,
        publicKey: WOMPI_PUBLIC_KEY,
        redirectUrl: window.location.origin + '/checkout-success.html',
    });

    checkout.open(function (result) {
        var transaction = result.transaction;
        if (transaction.status === 'APPROVED') {
            // Enviar pedido a WhatsApp/Email antes de vaciar
            sendOrderNotification(shippingData, cart, reference);
            cart = [];
            saveCart();
            renderCart();
        }
    });
}

function sendOrderNotification(shipping, items, ref) {
    const subtotal = getCartSubtotal();
    const shippingCost = getShippingCost();
    const total = getCartTotal();

    const message = `Nuevo Pedido #${ref}\n\nCliente: ${shipping.name}\nDirección: ${shipping.address}\nCiudad: ${shipping.city}\nTel: ${shipping.phone}\n\nDetalle:\n${items.map(i => `- ${i.name} x${i.quantity}`).join('\n')}\n\nSubtotal: $${subtotal.toLocaleString()}\nEnvío: ${shippingCost === 0 ? 'GRATIS' : '$' + shippingCost.toLocaleString()}\nTotal: $${total.toLocaleString()}`;
    
    // WhatsApp redirect
    const waUrl = `https://wa.me/573000000000?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

// ==========================================
// 8. EVENT LISTENERS & INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Escuchar botones de "Añadir al carrito"

    // Escuchar botones de "Añadir al carrito"
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.cart-trigger');
        if (btn) {
            const product = {
                id: btn.dataset.productId || 'edicion-selecta-antioquia',
                name: btn.dataset.productName || 'Edición Selecta — Antioquia',
                price: parseInt(btn.dataset.productPrice) || 24900,
                image: btn.dataset.productImage || 'fotos productos/DSC07203.jpg'
            };
            addToCart(product);
        }
    });

    // Close cart triggers
    document.getElementById('open-cart-btn')?.addEventListener('click', openCart);
    
    // Load the external drawer
    loadCartDrawer();

    renderCart();

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

    // 4. Parallax Scroll & Navbar Dynamics (Optimized for 120Hz/Mobile)
    const navbar = document.getElementById('navbar');
    const heroMedia = document.getElementById('hero-media');
    const heroMask = document.getElementById('hero-mask');
    const parallaxImages = document.querySelectorAll('.js-parallax');

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateElements() {
        const scrollY = window.scrollY;

        // Hero Mask Scale Effect (Specific for home/main pages)
        if (heroMask && scrollY < window.innerHeight * 1.5) {
            const scale = 1 + (scrollY / 100);
            heroMask.style.transform = `translate3d(0,0,0) scale(${scale})`;
            if (heroMedia) heroMedia.style.transform = `translate3d(0,0,0) scale(${1 + scrollY * 0.0005})`;
        }

        // Global Parallax for images
        parallaxImages.forEach(img => {
            const speed = img.getAttribute('data-speed') || 0.1;
            const parent = img.parentElement;
            const rect = parent.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });

        // Navbar Background Logic (Optimized Class Toggling)
        if (navbar) {
            const isScrolled = scrollY > 100;
            if (isScrolled && !navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.add('navbar-scrolled', 'py-4', 'bg-theme-bg/90', 'backdrop-blur-xl', 'text-theme-text', 'shadow-sm');
                navbar.classList.remove('py-8', 'mix-blend-difference', 'text-white');
            } else if (!isScrolled && navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.remove('navbar-scrolled', 'py-4', 'bg-theme-bg/90', 'backdrop-blur-xl', 'text-theme-text', 'shadow-sm');
                navbar.classList.add('py-8', 'mix-blend-difference', 'text-white');
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateElements);
            ticking = true;
        }
    }, { passive: true });

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

    // 9. Multilingual System (ES/EN)
    const translations = {
        es: {
            "nav-home": "Inicio",
            "nav-philosophy": "La Filosofía",
            "nav-process": "El Proceso",
            "nav-collection": "Nuestros Cafés",
            "nav-house": "Nuestra Casa",
            "nav-menu": "Menú",
            "nav-back": "Volver",
            "nav-cart": "Carrito",
            "hero-philosophy": "REBELIÓN",
            "hero-process": "MÉTODO",
            "hero-collection": "NUESTROS CAFÉS",
            "hero-house": "EL REFUGIO",
            "hero-tagline": "Tostión artesanal en el corazón de los Andes. Un viaje sensorial en cada taza.",
            "hero-est": "Est. 2026",
            "marquee-text": "✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦ TOSTIÓN MEDIA ✦ COMERCIO JUSTO ✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦ TOSTIÓN MEDIA ✦ COMERCIO JUSTO ✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦",
            "phi-num": "01 — Origen",
            "phi-title": "EL ALMA DE EL <br><span class='italic font-light text-theme-text/40'>TOSTADO.</span>",
            "phi-text": "No solo vendemos café; preservamos una herencia. Cada grano de Don Gonzalo es un testimonio del respeto por la tierra y por quienes la trabajan.",
            "phi-btn": "Nuestro Manifiesto Completo",
            "prod-edition": "Edición Selecta",
            "prod-notes": "Notas: Chocolate, Durazno, Cítrico.",
            "prod-desc": "Un perfil sensorial brillante diseñado para despertar los sentidos. Recuenta la frescura del rocío matutino en las montañas de Antioquia.",
            "prod-grind": "Molienda",
            "prod-grind-grain": "Grano",
            "prod-grind-v60": "Media (V60)",
            "prod-add": "Agregar a la mochila",
            "prod-specs-title": "Ficha Técnica",
            "prod-spec-alt": "Altura: 1.950 MSNM",
            "prod-spec-var": "Variedad: 100% Arábica",
            "prod-spec-region": "Región: Antioquia",
            "prod-spec-score": "Tueste: Medio",
            "prod-brew-title": "Guía de Preparación",
            "prod-brew-step1": "1. Molienda media-fina (similar a la sal de mesa).",
            "prod-brew-step2": "2. Agua a 92°C para extraer la dulzura sin amargor.",
            "prod-brew-step3": "3. Ratio 1:15 para resaltar la acidez brillante.",
            "phi-hero-cap": "Capítulo I",
            "phi-hero-tag": "Un pacto con el origen.",
            "phi-h2": "Nuestra <br><span class='italic font-light text-theme-text/40'>Rebelión.</span>",
            "phi-p1": "Durante décadas, el mejor grano de Colombia ha cruzado océanos, dejando atrás a quienes lo cultivan con el mayor de los cariños. Don Gonzalo nace para revertir esa historia.",
            "phi-p2": "Nuestra rebelión es contra la mediocridad y el olvido. Somos el puente entre la mística de la montaña y tu taza diaria, asegurando que la excelencia se quede en casa.",
            "phi-impact-h2": "Impacto <br><span class='italic font-light text-theme-text/40'>en Origen.</span>",
            "phi-impact-p": "Trabajamos mano a mano con caficultores independientes de Antioquia y Huila. Compramos café procesado con maestría, pagando precios que honran el sudor y la tierra.",
            "phi-pause-h2": "El Arte <br><span class='italic font-light text-theme-text/40'>de la Pausa.</span>",
            "phi-pause-p": "En un mundo que corre, nosotros nos detenemos. El café de especialidad no es solo cafeína; es un recordatorio de que los mejores resultados toman tiempo, paciencia y silencio.",
            "phi-eco-h2": "Sostenibilidad <br><span class='italic font-light text-theme-text/40'>de Alta Montaña.</span>",
            "phi-eco-p": "Nuestros procesos de beneficio en seco y fermentaciones controladas minimizan el uso de agua. Cuidamos los bosques generacionales tanto como cuidamos el grano.",
            "phi-legacy-h2": "El Legado <br><span class='italic font-light text-theme-text/40'>de Gonzalo.</span>",
            "phi-legacy-p": "Bautizados en honor a la sabiduría del campo. Gonzalo representa a miles de arrieros y recolectores que, con manos callosas, han construido la grandeza de nuestra tierra.",
            "phi-chapter3": "Capítulo III",
            "phi-chapter4": "Capítulo IV",
            "phi-chapter5": "Capítulo V",
            "phi-cta-title": "Vive el ritual del origen.",
            "proc-hero": "MÉTODO",
            "proc-hero-cap": "Capítulo II",
            "proc-hero-tag": "La ciencia detrás del sentimiento.",
            "proc-step1-title": "01",
            "proc-step1-h2": "Cosecha <br><span class='italic font-light text-theme-text/40'>Selectiva.</span>",
            "proc-step1-p": "Recorremos los cafetales de altura, seleccionando solo las cerezas en su punto óptimo de madurez. Un trabajo de paciencia que garantiza la dulzura desde el origen.",
            "proc-step2-title": "02",
            "proc-step2-h2": "Beneficio <br><span class='italic font-light text-theme-text/40'>y Fermentación.</span>",
            "proc-step2-p": "Transformamos el fruto. Según el perfil buscado (Lavado, Natural o Honey), liberamos el alma del grano preservando sus notas frutales y florales.",
            "proc-step3-title": "03",
            "proc-step3-h2": "Secado <br><span class='italic font-light text-theme-text/40'>Controlado.</span>",
            "proc-step3-p": "El sol andino hace su parte. En patios o marquesinas, el café reposa hasta alcanzar la humedad ideal, clave para su conservación y sabor.",
            "proc-step4-title": "04",
            "proc-step4-h2": "Trilla <br><span class='italic font-light text-theme-text/40'>de Calidad.</span>",
            "proc-step4-p": "Retiramos el pergamino y clasificamos cada grano por tamaño, densidad y color. Solo lo mejor de la cosecha se convierte en Don Gonzalo.",
            "proc-step5-title": "05",
            "proc-step5-h2": "Tostión <br><span class='italic font-light text-theme-text/40'>de Autor.</span>",
            "proc-step5-p": "En el fuego se revela el ADN. Desarrollamos perfiles de tueste medio que resaltan la acidez brillante y el cuerpo sedoso de nuestras montañas.",
            "proc-step6-title": "06",
            "proc-step6-h2": "Excelencia <br><span class='italic font-light text-theme-text/40'>en Taza.</span>",
            "proc-step6-p": "Probamos cada lote para asegurar la excelencia sensorial. Sellamos en origen para que la mística del campo llegue intacta a tu hogar.",
            "proc-btn": "Explorar nuestro método",
            "coll-hero": "NUESTROS CAFÉS",
            "coll-hero-tag": "Ediciones limitadas de origen único.",
            "coll-filter-title": "Variedad",
            "coll-num": "03 — Catálogo",
            "coll-title": "EDICIONES <br><span class='italic font-light text-theme-text/40'>LIMITADAS.</span>",
            "coll-text": "Nuestras variedades provienen de microlotes seleccionados por su origen único. Solo traemos la excelencia de cada cosecha en su momento pico.",
            "coll-btn": "Explorar la Tienda",
            "coll-prod1-tag": "Origen — Antioquia",
            "coll-prod1-title": "Edición Selecta",
            "coll-prod2-tag": "Origen — Nariño",
            "coll-prod2-title": "Edición Gourmet",
            "coll-view-details": "Ver Detalles",
            "house-num": "04 — Medellín",
            "house-title": "EL <br><span class='italic font-light text-white/50'>REFUGIO.</span>",
            "house-btn": "Ubicación y Horarios",
            "casa-hero": "EL REFUGIO",
            "casa-hero-tag": "Donde el grano encuentra su lugar.",
            "casa-hero-cap": "Visítanos",
            "casa-address": "Carrera 110<br><span class='italic font-light text-theme-text/40'>35F-27, Comuna 13.</span>",
            "casa-hours-title": "Horarios",
            "casa-hours-week": "Lunes a Sábado: 08:00 — 20:00",
            "casa-hours-sun": "Domingos: 10:00 — 18:00",
            "casa-experience-title": "La Experiencia",
            "casa-experience-p": "Ven a probar nuestras ediciones limitadas, participa en talleres de catación o simplemente disfruta de un espacio diseñado para la pausa creativa.",
            "cart-title": "Mochila",
            "cart-empty": "Tu mochila está vacía",
            "cart-explore": "Explorar Tienda",
            "cart-close": "Cerrar",
            "footer-talk": "¿Hablamos de <br /><span class='italic text-theme-accent'>Café?</span>",
            "footer-join": "Únete a la Rebelión",
            "footer-connect": "Conecta",
            "footer-join-btn": "Unir",
            "footer-copy": "© 2026 Don Gonzalo.",
            "footer-tag": "Tostado en la Montaña."
        },
        en: {
            "nav-home": "Home",
            "nav-philosophy": "Philosophy",
            "nav-process": "The Process",
            "nav-collection": "Our Coffees",
            "nav-house": "Our House",
            "nav-menu": "Menu",
            "nav-back": "Back",
            "nav-cart": "Cart",
            "hero-philosophy": "REBELLION",
            "hero-process": "METHOD",
            "hero-collection": "OUR COFFEES",
            "hero-house": "THE SHELTER",
            "hero-tagline": "Handcrafted roasting in the heart of the Andes. A sensory journey in every cup.",
            "hero-est": "Est. 2026",
            "marquee-text": "✦ SINGLE ORIGIN ✦ 100% COLOMBIAN ✦ MEDIUM ROAST ✦ FAIR TRADE ✦ SINGLE ORIGIN ✦ 100% COLOMBIAN ✦ MEDIUM ROAST ✦ FAIR TRADE ✦ SINGLE ORIGIN ✦ 100% COLOMBIAN ✦",
            "phi-num": "01 — Origin",
            "phi-title": "THE SOUL OF THE <br><span class='italic font-light text-theme-text/40'>ROAST.</span>",
            "phi-text": "We don’t just sell coffee; we preserve a heritage. Every Don Gonzalo bean is a testimony of respect for the land and those who work it.",
            "phi-btn": "Our Complete Manifesto",
            "phi-hero-cap": "Chapter I",
            "phi-hero-tag": "A pact with the source.",
            "phi-h2": "Our <br><span class='italic font-light text-theme-text/40'>Rebellion.</span>",
            "phi-p1": "For decades, Colombia's best grain has crossed oceans, leaving behind those who cultivate it with the greatest affection. Don Gonzalo was born to reverse that story.",
            "phi-p2": "Our rebellion is against mediocrity and oblivion. We are the bridge between the mystique of the mountain and your daily cup, ensuring that excellence stays at home.",
            "phi-impact-h2": "Impact <br><span class='italic font-light text-theme-text/40'>at Origin.</span>",
            "phi-impact-p": "We work hand-in-hand with independent coffee farmers from Antioquia and Huila. We buy professionally processed coffee, paying prices that honor sweat and land.",
            "phi-pause-h2": "The Art <br><span class='italic font-light text-theme-text/40'>of the Pause.</span>",
            "phi-pause-p": "In a world that rushes, we stop. Specialty coffee is not just caffeine; it's a reminder that the best results take time, patience, and silence.",
            "phi-eco-h2": "High Mountain <br><span class='italic font-light text-theme-text/40'>Sustainability.</span>",
            "phi-eco-p": "Our dry processing and controlled fermentations minimize water use. We care for generational forests as much as we care for the bean.",
            "phi-legacy-h2": "Gonzalo's <br><span class='italic font-light text-theme-text/40'>Legacy.</span>",
            "phi-legacy-p": "Named in honor of countryside wisdom. Gonzalo represents thousands of muleteers and harvesters who, with calloused hands, have built the greatness of our land.",
            "phi-chapter3": "Chapter III",
            "phi-chapter4": "Chapter IV",
            "phi-chapter5": "Chapter V",
            "phi-cta-title": "Live the origin ritual.",
            "proc-hero": "METHOD",
            "proc-hero-cap": "Chapter II",
            "proc-hero-tag": "The science behind the feeling.",
            "proc-step1-title": "01",
            "proc-step1-h2": "Selective <br><span class='italic font-light text-theme-text/40'>Harvest.</span>",
            "proc-step1-p": "We walk through the high-altitude coffee plantations, selecting only the cherries at their optimal point of maturity. A labor of patience that guarantees sweetness from the source.",
            "proc-step2-title": "02",
            "proc-step2-h2": "Processing <br><span class='italic font-light text-theme-text/40'>& Fermentation.</span>",
            "proc-step2-p": "We transform the fruit. Depending on the desired profile (Washed, Natural, or Honey), we release the soul of the bean while preserving its fruity and floral notes.",
            "proc-step3-title": "03",
            "proc-step3-h2": "Controlled <br><span class='italic font-light text-theme-text/40'>Drying.</span>",
            "proc-step3-p": "The Andean sun does its part. In patios or sheds, the coffee rests until it reaches the ideal humidity, key to its conservation and flavor.",
            "proc-step4-title": "04",
            "proc-step4-h2": "Quality <br><span class='italic font-light text-theme-text/40'>Milling.</span>",
            "proc-step4-p": "We remove the parchment and classify each bean by size, density, and color. Only the best of the harvest becomes Don Gonzalo.",
            "proc-step5-title": "05",
            "proc-step5-h2": "Signature <br><span class='italic font-light text-theme-text/40'>Roasting.</span>",
            "proc-step5-p": "The DNA is revealed in the fire. We develop medium roast profiles that highlight the bright acidity and silky body of our mountains.",
            "proc-step6-title": "06",
            "proc-step6-h2": "Excellence <br><span class='italic font-light text-theme-text/40'>in Cup.</span>",
            "proc-step6-p": "We test each batch to ensure sensory excellence. We seal at the source so that the mystique of the countryside reaches your home intact.",
            "proc-btn": "Explore our method",
            "coll-num": "03 — Catalog",
            "coll-title": "LIMITED <br><span class='italic font-light text-theme-text/40'>EDITIONS.</span>",
            "coll-text": "Our varieties come from selected micro-lots for their unique origin. We only bring the excellence of each harvest at its peak moment.",
            "coll-btn": "Explore the Shop",
            "house-num": "04 — Medellín",
            "house-title": "THE <br><span class='italic font-light text-white/50'>SHELTER.</span>",
            "house-btn": "Location and Hours",
            "casa-hero": "THE SHELTER",
            "casa-hero-tag": "Where the bean finds its place.",
            "casa-hero-cap": "Visit Us",
            "casa-address": "Carrera 110<br><span class='italic font-light text-theme-text/40'>35F-27, Comuna 13.</span>",
            "casa-hours-title": "Hours",
            "casa-hours-week": "Monday to Saturday: 08:00 — 20:00",
            "casa-hours-sun": "Sundays: 10:00 — 18:00",
            "casa-experience-title": "The Experience",
            "casa-experience-p": "Come try our limited editions, participate in cupping workshops, or simply enjoy a space designed for creative pause.",
            "prod-edition": "Select Edition",
            "prod-notes": "Notes: Chocolate, Peach, Citrus.",
            "prod-desc": "A bright sensory profile designed to awaken the senses. It recounts the freshness of the morning dew in the mountains of Antioquia.",
            "prod-grind": "Grind",
            "prod-grind-grain": "Whole Bean",
            "prod-grind-v60": "Medium (V60)",
            "prod-add": "Add to backpack",
            "prod-specs-title": "Technical Sheet",
            "prod-spec-alt": "Altitude: 1,950 MASL",
            "prod-spec-var": "Variety: 100% Arabica",
            "prod-spec-region": "Region: Antioquia",
            "prod-spec-score": "Roast: Medium",
            "prod-brew-title": "Brewing Guide",
            "prod-brew-step1": "1. Medium-fine grind (similar to table salt).",
            "prod-brew-step2": "2. Water at 92°C to extract sweetness without bitterness.",
            "prod-brew-step3": "3. 1:15 ratio to highlight bright acidity.",
            "coll-hero": "OUR COFFEES",
            "coll-hero-tag": "Limited editions of unique origin.",
            "coll-filter-title": "Variety",
            "coll-prod1-tag": "Origin — Antioquia",
            "coll-prod1-title": "Select Edition",
            "coll-prod2-tag": "Origin — Nariño",
            "coll-prod2-title": "Gourmet Edition",
            "coll-view-details": "View Details",
            "cart-title": "Backpack",
            "cart-empty": "Your backpack is empty",
            "cart-explore": "Explore Shop",
            "cart-close": "Close",
            "footer-talk": "Let's Talk <br /><span class='italic text-theme-accent'>Coffee?</span>",
            "footer-join": "Join the Rebellion",
            "footer-connect": "Connect",
            "footer-join-btn": "Join",
            "footer-copy": "© 2026 Don Gonzalo.",
            "footer-tag": "Roasted in the Mountain."
        }
    };

    let currentLang = localStorage.getItem('don-gonzalo-lang') || 'es';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('don-gonzalo-lang', lang);
        currentLang = lang;
        
        // Update toggle indicator if it exists
        const langToggle = document.getElementById('lang-toggle-text');
        if (langToggle) langToggle.innerText = lang.toUpperCase();

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    // Initial language load
    updateLanguage(currentLang);

    // Reliable listener for language toggle
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('#lang-toggle');
        if (langBtn) {
            e.preventDefault();
            const nextLang = currentLang === 'es' ? 'en' : 'es';
            updateLanguage(nextLang);
        }
    });

    // 10. Horizontal Scroll Interaction System
    function setupHorizontalScroll(containerId, prevId, nextId, progressId) {
        const scrollContainer = document.getElementById(containerId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const progressBar = document.getElementById(progressId);

        if (!scrollContainer) return;

        scrollContainer.addEventListener('scroll', () => {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (maxScroll <= 0) return;
            
            const scrollPercentage = (scrollContainer.scrollLeft / maxScroll) * 100;
            if (progressBar) progressBar.style.width = `${scrollPercentage}%`;

            if (prevBtn) {
                if (scrollContainer.scrollLeft < 20) {
                    prevBtn.style.opacity = '0';
                    prevBtn.style.pointerEvents = 'none';
                } else {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.pointerEvents = 'auto';
                }
            }
            if (nextBtn) {
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth > scrollContainer.scrollWidth - 20) {
                    nextBtn.style.opacity = '0';
                    nextBtn.style.pointerEvents = 'none';
                } else {
                    nextBtn.style.opacity = '1';
                    nextBtn.style.pointerEvents = 'auto';
                }
            }
        });

        prevBtn?.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -scrollContainer.clientWidth * 0.8, behavior: 'smooth' });
        });
        nextBtn?.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: scrollContainer.clientWidth * 0.8, behavior: 'smooth' });
        });

        // Wheel Bypass Refinado: Permite salir del scroll horizontal suavemente
        scrollContainer.addEventListener('wheel', (e) => {
            // Ignorar si el scroll es principalmente horizontal (trackpads)
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            const scrollLeft = scrollContainer.scrollLeft;
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const tolerance = 5; // Píxeles de margen para evitar errores de redondeo

            const isAtStart = scrollLeft <= tolerance;
            const isAtEnd = scrollLeft >= maxScroll - tolerance;

            // CASO 1: Scrollear hacia arriba estando al inicio -> Dejar que scrollee la página
            if (e.deltaY < 0 && isAtStart) return;

            // CASO 2: Scrollear hacia abajo estando al final -> Dejar que scrollee la página
            if (e.deltaY > 0 && isAtEnd) return;

            // CASO 3: Estamos en medio -> Scrolleo horizontal y bloqueamos el vertical de la página
            scrollContainer.scrollLeft += e.deltaY;
            e.preventDefault();
        }, { passive: false });

        scrollContainer.dispatchEvent(new Event('scroll'));
    }

    // Inicializar galerías
    setupHorizontalScroll('proceso-scroll', 'prev-step', 'next-step', 'scroll-progress');
    setupHorizontalScroll('casa-scroll', 'prev-casa', 'next-casa', null);

    // --- LÓGICA DE PRODUCTOS DINÁMICOS ---
    const productData = {
        'edicion-selecta': {
            id: 'edicion-selecta-antioquia',
            name: { es: 'Selecta', en: 'Select' },
            fullName: { es: 'Edición Selecta — Antioquia', en: 'Select Edition — Antioquia' },
            price: 54000,
            image: 'fotos productos/DSC07203.jpg',
            origin: { es: 'Urrao, Antioquia', en: 'Urrao, Antioquia' },
            altitude: '1.950 MSNM',
            variety: 'Caturra Chiroso',
            score: '88 pts',
            notes: { es: 'Chocolate, Durazno, Cítrico', en: 'Chocolate, Peach, Citrus' },
            desc: { 
                es: 'Un perfil sensorial brillante diseñado para despertar los sentidos. Recuenta la frescura del rocío matutino en las montañas de Antioquia.',
                en: 'A bright sensory profile designed to awaken the senses. It recounts the freshness of the morning dew in the mountains of Antioquia.'
            }
        },
        'edicion-gourmet': {
            id: 'edicion-gourmet-narino',
            name: { es: 'Gourmet', en: 'Gourmet' },
            fullName: { es: 'Edición Gourmet — Nariño', en: 'Gourmet Edition — Nariño' },
            price: 54000,
            image: 'fotos productos/DSC07212.jpg',
            origin: { es: 'Sandoná, Nariño', en: 'Sandoná, Nariño' },
            altitude: '2.100 MSNM',
            variety: 'Castillo / Colombia',
            score: '87.5 pts',
            notes: { es: 'Caramelo, Cacao, Frutal', en: 'Caramel, Cocoa, Fruity' },
            desc: { 
                es: 'Intensidad y elegancia en equilibrio. Un café con cuerpo sedoso y un postgusto prolongado que evoca las tierras volcánicas del sur.',
                en: 'Intensity and elegance in balance. A coffee with a silky body and a long aftertaste that evokes the volcanic lands of the south.'
            }
        },
        'edicion-clasica': {
            id: 'edicion-clasica-tolima',
            name: { es: 'Clásica', en: 'Classic' },
            fullName: { es: 'Edición Clásica — Tolima', en: 'Classic Edition — Tolima' },
            price: 54000,
            image: 'fotos productos/DSC07220.jpg',
            origin: { es: 'Planadas, Tolima', en: 'Planadas, Tolima' },
            altitude: '1.750 MSNM',
            variety: 'Caturra / Colombia',
            score: '84 pts',
            notes: { es: 'Panela, Limón, Chocolate', en: 'Brown Sugar, Lemon, Chocolate' },
            desc: { 
                es: 'El sabor de la tradición. Un café balanceado y reconfortante, ideal para quienes buscan la esencia pura del café colombiano.',
                en: 'The taste of tradition. A balanced and comforting coffee, ideal for those seeking the pure essence of Colombian coffee.'
            }
        }
    };

    function loadDynamicProduct() {
        if (!window.location.pathname.includes('producto.html')) return;
        
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id') || 'edicion-selecta';
        const product = productData[productId];
        
        if (!product) return;

        // Actualizar UI
        document.title = `${product.name[currentLang]} — Don Gonzalo`;
        
        const mainImage = document.querySelector('.parallax-img');
        if (mainImage) mainImage.src = product.image;

        const priceEl = document.querySelector('.text-4xl.font-serif.text-theme-text\\/40');
        if (priceEl) priceEl.textContent = `$${product.price.toLocaleString()}`;

        const nameEl = document.querySelector('h1.text-6xl');
        if (nameEl) nameEl.textContent = `${product.name[currentLang]}.`;

        const descEl = document.querySelector('[data-i18n="prod-desc"]');
        if (descEl) descEl.textContent = product.desc[currentLang];

        const notesEl = document.querySelector('[data-i18n="prod-notes"]');
        if (notesEl) notesEl.textContent = `Notas: ${product.notes[currentLang]}`;

        const editionEl = document.querySelector('[data-i18n="prod-edition"]');
        if (editionEl) editionEl.textContent = product.fullName[currentLang].split(' — ')[0];

        // Ficha técnica
        const regionEl = document.querySelector('[data-i18n="prod-spec-region"]');
        if (regionEl) regionEl.textContent = product.origin[currentLang];

        const altEl = document.querySelector('[data-i18n="prod-spec-alt"]');
        if (altEl) altEl.textContent = product.altitude;

        const varEl = document.querySelector('[data-i18n="prod-spec-var"]');
        if (varEl) varEl.textContent = product.variety;

        const scoreEl = document.querySelector('[data-i18n="prod-spec-score"]');
        if (scoreEl) scoreEl.textContent = product.score;

        // Botón de compra
        const buyBtn = document.querySelector('.cart-trigger[data-product-id]');
        if (buyBtn) {
            buyBtn.dataset.productId = product.id;
            buyBtn.dataset.productName = product.fullName[currentLang];
            buyBtn.dataset.productPrice = product.price;
            buyBtn.dataset.productImage = product.image;
        }
    }

    // Call dynamic loader
    loadDynamicProduct();

    // Actualizar el loader cuando cambie el idioma
    const originalUpdateLanguage = typeof updateLanguage !== 'undefined' ? updateLanguage : null;
    if (originalUpdateLanguage) {
        updateLanguage = function(lang) {
            originalUpdateLanguage(lang);
            loadDynamicProduct();
        };
    }
});
