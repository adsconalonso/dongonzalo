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

    // 9. Multilingual System (ES/EN)
    const translations = {
        es: {
            "nav-home": "Inicio",
            "nav-philosophy": "La Filosofía",
            "nav-process": "El Proceso",
            "nav-collection": "Colección",
            "nav-house": "Nuestra Casa",
            "nav-menu": "Menú",
            "nav-back": "Volver",
            "nav-cart": "Carrito",
            "hero-philosophy": "REBELIÓN",
            "hero-process": "MÉTODO",
            "hero-collection": "COLECCIÓN",
            "hero-house": "EL REFUGIO",
            "hero-tagline": "Tostión artesanal en el corazón de los Andes. Un viaje sensorial en cada taza.",
            "hero-est": "Est. 2026",
            "marquee-text": "✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦ TOSTIÓN MEDIA ✦ COMERCIO JUSTO ✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦ TOSTIÓN MEDIA ✦ COMERCIO JUSTO ✦ CAFÉ DE ORIGEN ✦ 100% COLOMBIANO ✦",
            "phi-num": "01 — Origen",
            "phi-title": "EL ALMA DE EL <br><span class='italic font-light text-theme-text/40'>TOSTADO.</span>",
            "phi-text": "No solo vendemos café; preservamos una herencia. Cada grano de Don Gonzalo es un testimonio del respeto por la tierra y por quienes la trabajan.",
            "phi-btn": "Nuestro Manifiesto Completo",
            "prod-edition": "Edición Limitada",
            "prod-notes": "Notas: Miel silvestre, cáscara de naranja y jazmín.",
            "prod-desc": "Un perfil sensorial brillante diseñado para despertar los sentidos. Recuenta la frescura del rocío matutino en las montañas de Antioquia.",
            "prod-grind": "Molienda",
            "prod-grind-grain": "Grano",
            "prod-grind-v60": "Media (V60)",
            "prod-add": "Agregar a la mochila",
            "prod-specs-title": "Ficha Técnica",
            "prod-spec-alt": "Altura: 1.950 MSNM",
            "prod-spec-var": "Variedad: Caturra Chiroso",
            "prod-spec-region": "Región: Urrao, Antioquia",
            "prod-spec-score": "Puntaje: 88 pts",
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
            "coll-hero": "COLECCIÓN",
            "coll-hero-tag": "Ediciones limitadas de origen único.",
            "coll-filter-title": "Variedad",
            "coll-num": "03 — Catálogo",
            "coll-title": "EDICIONES <br><span class='italic font-light text-theme-text/40'>LIMITADAS.</span>",
            "coll-text": "Nuestras variedades provienen de microlotes seleccionados por su origen único. Solo traemos la excelencia de cada cosecha en su momento pico.",
            "coll-btn": "Explorar la Tienda",
            "coll-prod1-tag": "Amanecer — Antioquia",
            "coll-prod1-title": "Cítrico & Miel",
            "coll-prod2-tag": "Ocaso — Huila",
            "coll-prod2-title": "Chocolate & Nuez",
            "coll-view-details": "Ver Detalles",
            "house-num": "04 — Medellín",
            "house-title": "EL <br><span class='italic font-light text-white/50'>REFUGIO.</span>",
            "house-btn": "Ubicación y Horarios",
            "casa-hero": "EL REFUGIO",
            "casa-hero-tag": "Donde el grano encuentra su lugar.",
            "casa-hero-cap": "Visítanos",
            "casa-address": "Calle 10<br><span class='italic font-light text-theme-text/40'>#36-40, El Poblado.</span>",
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
            "nav-collection": "Collection",
            "nav-house": "Our House",
            "nav-menu": "Menu",
            "nav-back": "Back",
            "nav-cart": "Cart",
            "hero-philosophy": "REBELLION",
            "hero-process": "METHOD",
            "hero-collection": "COLLECTION",
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
            "casa-address": "10th Street<br><span class='italic font-light text-theme-text/40'>#36-40, El Poblado.</span>",
            "casa-hours-title": "Hours",
            "casa-hours-week": "Monday to Saturday: 08:00 — 20:00",
            "casa-hours-sun": "Sundays: 10:00 — 18:00",
            "casa-experience-title": "The Experience",
            "casa-experience-p": "Come try our limited editions, participate in cupping workshops, or simply enjoy a space designed for creative pause.",
            "prod-edition": "Limited Edition",
            "prod-notes": "Notes: Wild honey, orange peel and jasmine.",
            "prod-desc": "A bright sensory profile designed to awaken the senses. It recounts the freshness of the morning dew in the mountains of Antioquia.",
            "prod-grind": "Grind",
            "prod-grind-grain": "Whole Bean",
            "prod-grind-v60": "Medium (V60)",
            "prod-add": "Add to backpack",
            "prod-specs-title": "Technical Sheet",
            "prod-spec-alt": "Altitude: 1,950 MASL",
            "prod-spec-var": "Variety: Chiroso Caturra",
            "prod-spec-region": "Region: Urrao, Antioquia",
            "prod-spec-score": "Score: 88 pts",
            "prod-brew-title": "Brewing Guide",
            "prod-brew-step1": "1. Medium-fine grind (similar to table salt).",
            "prod-brew-step2": "2. Water at 92°C to extract sweetness without bitterness.",
            "prod-brew-step3": "3. 1:15 ratio to highlight bright acidity.",
            "coll-hero": "COLLECTION",
            "coll-hero-tag": "Limited editions of unique origin.",
            "coll-filter-title": "Variety",
            "coll-prod1-tag": "Amanecer — Antioquia",
            "coll-prod1-title": "Citrus & Honey",
            "coll-prod2-tag": "Ocaso — Huila",
            "coll-prod2-title": "Chocolate & Nut",
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
});
