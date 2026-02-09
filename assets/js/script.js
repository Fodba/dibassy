/* =========================================
   DIBASSY LANDING PAGE V2 - JAVASCRIPT TAROT
   Animations + Interactions
   Version optimisée SEO avec nouveau contenu
   ========================================= */

(function() {
    'use strict';

    /* =========================================
       PARTICULES DORÉES (CANVAS) - OPTIMISÉES
       ========================================= */

    class ParticleSystem {
        constructor() {
            this.canvas = document.getElementById('particles-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = this.getParticleCount();
            
            this.resize();
            this.createParticles();
            this.animate();
            
            // Resize handler avec debounce
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resize();
                    this.createParticles();
                }, 250);
            });
        }
        
        getParticleCount() {
            // Adaptation selon taille écran
            const width = window.innerWidth;
            if (width < 768) return 80;      // Mobile
            if (width < 1024) return 120;    // Tablet
            return 150;                       // Desktop
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 4 + 2, // 2-6px
                    speedX: (Math.random() - 0.5) * 0.8,
                    speedY: (Math.random() - 0.5) * 0.8,
                    opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
                    twinkle: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.02 + 0.01
                });
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Déplacement
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges (réapparaît de l'autre côté)
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Effet de scintillement
                particle.twinkle += particle.twinkleSpeed;
                const twinkleOpacity = particle.opacity * (0.7 + Math.sin(particle.twinkle) * 0.3);
                
                // Draw particle avec GLOW
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = `rgba(212, 175, 55, ${twinkleOpacity})`;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 175, 55, ${twinkleOpacity})`;
                this.ctx.fill();
                
                // Halo supplémentaire
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 175, 55, ${twinkleOpacity * 0.2})`;
                this.ctx.fill();
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }


    
    /* =========================================
       NAVIGATION LATÉRALE ACTIVE
       ========================================= */

    function initNavigation() {
        const navCards = document.querySelectorAll('.nav-card');
        const sections = document.querySelectorAll('section[id]');
        
        if (!navCards.length || !sections.length) return;
        
        // Observer pour détecter quelle section est visible
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Retirer active de tous
                    navCards.forEach(card => card.classList.remove('active'));
                    
                    // Ajouter active au bon
                    const activeCard = document.querySelector(`.nav-card[href="#${sectionId}"]`);
                    if (activeCard) {
                        activeCard.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }

    /* =========================================
   MENU BURGER MOBILE
   ========================================= */

    function initBurgerMenu() {
        const burger = document.querySelector('.burger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

        // Si les éléments n'existent pas, sortir
        if (!burger || !mobileNav) {
            console.log('Burger menu elements not found');
            return;
        }

        // Créer overlay (fond sombre)
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);

        // Fonction pour ouvrir le menu
        function openMenu() {
            mobileNav.classList.add('active');
            mobileNav.removeAttribute('hidden');
            overlay.classList.add('active');
            burger.classList.add('active');
            burger.setAttribute('aria-expanded', 'true');

            // Empêcher scroll du body
            document.body.style.overflow = 'hidden';
        }

        // Fonction pour fermer le menu
        function closeMenu() {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');

            // Réactiver scroll du body
            document.body.style.overflow = '';

            // Attendre la fin de l'animation avant de cacher
            setTimeout(() => {
                if (!mobileNav.classList.contains('active')) {
                    mobileNav.setAttribute('hidden', '');
                }
            }, 400);
        }

        // Clic sur burger : toggle
        burger.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Clic sur bouton fermer
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Clic sur overlay : fermer
        overlay.addEventListener('click', closeMenu);

        // Clic sur un lien : fermer le menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Échap pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* =========================================
       ACCORDÉON FAQ
       ========================================= */

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item-tarot');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question-tarot');
            const answer = item.querySelector('.faq-answer-tarot');
            
            if (!question || !answer) return;
            
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Fermer tous les autres
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question-tarot');
                    const otherAnswer = otherItem.querySelector('.faq-answer-tarot');
                    if (otherItem !== item) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.setAttribute('hidden', '');
                    }
                });
                
                // Toggle current
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.setAttribute('hidden', '');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.removeAttribute('hidden');
                }
            });
        });
    }

    /* =========================================
       FLIP CARTES AU TAP (MOBILE/TABLET)
       ========================================= */

    // function initCardFlip() {
    //     const flipCards = document.querySelectorAll('.tarot-card-flip');
        
    //     // Détection mobile/tablet
    //     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
    //     if (!isTouchDevice) return; // Desktop utilise hover CSS
        
    //     flipCards.forEach(card => {
    //         card.addEventListener('click', (e) => {
    //             e.preventDefault();
                
    //             // Toggle la classe flipped
    //             card.classList.toggle('flipped');
                
    //             // Si la carte vient d'être retournée (face avant visible)
    //             if (card.classList.contains('flipped')) {
    //                 // Scroll vers le haut de la carte pour voir tout le contenu
    //                 const cardRect = card.getBoundingClientRect();
    //                 const offsetTop = cardRect.top + window.pageYOffset - 100;
                    
    //                 window.scrollTo({
    //                     top: offsetTop,
    //                     behavior: 'smooth'
    //                 });
    //             }
    //         });
    //     });
    // }

    /* =========================================
   FLIP CARTES AU TAP (MOBILE/TABLET)
   ========================================= */

    // function initCardFlip() {
    //     const flipCards = document.querySelectorAll('.tarot-card-flip');

    //     // Détection mobile/tablet
    //     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    //     if (!isTouchDevice) return; // Desktop utilise hover CSS

    //     flipCards.forEach(card => {
    //         const cardBack = card.querySelector('.card-back-side');
    //         const cardContent = card.querySelector('.card-content-domain');

    //         let isScrolling = false;
    //         let startY = 0;

    //         // Détection du début du touch
    //         card.addEventListener('touchstart', (e) => {
    //             startY = e.touches[0].clientY;
    //             isScrolling = false;
    //         }, { passive: true });

    //         // Détection du mouvement (scroll vs tap)
    //         card.addEventListener('touchmove', (e) => {
    //             const currentY = e.touches[0].clientY;
    //             const deltaY = Math.abs(currentY - startY);

    //             // Si mouvement vertical > 10px, c'est un scroll
    //             if (deltaY > 10) {
    //                 isScrolling = true;
    //             }
    //         }, { passive: true });

    //         // Clic/Tap final
    //         card.addEventListener('click', (e) => {
    //             // Si on scrollait, ne pas flipper
    //             if (isScrolling) {
    //                 return;
    //             }

    //             // Si clic sur la zone de contenu scrollable ET carte déjà flippée, ne pas flipper
    //             const isFlipped = card.classList.contains('flipped');
    //             const clickedOnContent = cardContent && cardContent.contains(e.target);

    //             if (isFlipped && clickedOnContent) {
    //                 // Laisser le scroll fonctionner
    //                 return;
    //             }

    //             // Sinon, flipper la carte
    //             e.preventDefault();
    //             card.classList.toggle('flipped');

    //             // Si la carte vient d'être retournée (face avant visible)
    //             if (card.classList.contains('flipped')) {
    //                 // Scroll vers le haut de la carte pour voir tout le contenu
    //                 setTimeout(() => {
    //                     const cardRect = card.getBoundingClientRect();
    //                     const offsetTop = cardRect.top + window.pageYOffset - 100;

    //                     window.scrollTo({
    //                         top: offsetTop,
    //                         behavior: 'smooth'
    //                     });
    //                 }, 100);
    //             }
    //         });

    //         // Alternative : Zone de flip spécifique (DOS de carte uniquement)
    //         if (cardBack) {
    //             cardBack.addEventListener('click', (e) => {
    //                 if (!card.classList.contains('flipped')) {
    //                     e.stopPropagation();
    //                     card.classList.add('flipped');

    //                     setTimeout(() => {
    //                         const cardRect = card.getBoundingClientRect();
    //                         const offsetTop = cardRect.top + window.pageYOffset - 100;

    //                         window.scrollTo({
    //                             top: offsetTop,
    //                             behavior: 'smooth'
    //                         });
    //                     }, 100);
    //                 }
    //             });
    //         }
    //     });
    // }

    /* =========================================
   FLIP CARTES AU TAP (MOBILE/TABLET)
   ========================================= */

    function initCardFlip() {
        const flipCards = document.querySelectorAll('.tarot-card-flip');

        // Détection mobile/tablet
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) return; // Desktop utilise hover CSS

        flipCards.forEach(card => {
            const cardContent = card.querySelector('.card-content-domain');

            let isScrolling = false;
            let startY = 0;

            // Détection du début du touch
            card.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                isScrolling = false;
            }, { passive: true });

            // Détection du mouvement (scroll vs tap)
            card.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const deltaY = Math.abs(currentY - startY);

                // Si mouvement vertical > 10px, c'est un scroll
                if (deltaY > 10) {
                    isScrolling = true;
                }
            }, { passive: true });

            // Clic sur la carte
            card.addEventListener('click', (e) => {
                // Si on scrollait, ne rien faire
                if (isScrolling) {
                    return;
                }

                const isFlipped = card.classList.contains('flipped');
                const clickedOnContent = cardContent && cardContent.contains(e.target);

                // Si carte déjà flippée et clic sur contenu, ne rien faire (permettre scroll)
                if (isFlipped && clickedOnContent) {
                    return;
                }

                // ← NOUVEAU : Fermer TOUTES les autres cartes avant de flipper celle-ci
                flipCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('flipped');
                    }
                });

                // Toggle la carte actuelle
                e.preventDefault();
                card.classList.toggle('flipped');

                // Si la carte vient d'être retournée (face avant visible)
                if (card.classList.contains('flipped')) {
                    // Scroll vers la carte
                    setTimeout(() => {
                        const cardRect = card.getBoundingClientRect();
                        const offsetTop = cardRect.top + window.pageYOffset - 100;

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        });
    }

    /* =========================================
       SCROLL REVEAL ANIMATIONS
       ========================================= */

    function initScrollReveal() {
        // Ajouter classe au body pour activer les animations
        document.body.classList.add('reveal-ready');
        
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        if (!revealElements.length) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Ne plus observer une fois visible
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => observer.observe(el));
    }

    /* =========================================
       SMOOTH SCROLL
       ========================================= */

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorer les liens vides
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 100; // Petit offset pour respirer
                    
                    window.scrollTo({
                        top: offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* =========================================
       SCROLL TO TOP BUTTON
       ========================================= */

    function initScrollToTop() {
        let scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.className = 'scroll-to-top-tarot';
        scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
        
        document.body.appendChild(scrollTopBtn);
        
        // Afficher/cacher selon scroll avec debounce
        let timeout;
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(timeout);
            
            // Limiter les appels pour performance
            const currentScrollY = window.pageYOffset;
            if (Math.abs(currentScrollY - lastScrollY) < 50) return;
            lastScrollY = currentScrollY;
            
            timeout = setTimeout(() => {
                if (window.pageYOffset > 600) {
                    scrollTopBtn.style.opacity = '1';
                    scrollTopBtn.style.visibility = 'visible';
                } else {
                    scrollTopBtn.style.opacity = '0';
                    scrollTopBtn.style.visibility = 'hidden';
                }
            }, 100);
        });
        
        // Click handler
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* =========================================
       ANALYTICS TRACKING
       ========================================= */

    function initTracking() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-float');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const href = button.getAttribute('href');
                const text = button.textContent.trim();
                
                // Google Analytics (si installé)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        'event_category': 'CTA',
                        'event_label': text,
                        'value': href
                    });
                }
                
                // Facebook Pixel (si installé)
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Contact', {
                        content_name: text
                    });
                }
                
                // Console log pour debug
                console.log('CTA clicked:', text, href);
            });
        });
        
        // Tracking scroll depth
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Tracker les milestones
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                        trackedMilestones.add(milestone);
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll_depth', {
                                'event_category': 'Engagement',
                                'event_label': `${milestone}%`,
                                'value': milestone
                            });
                        }
                        
                        console.log(`Scroll depth: ${milestone}%`);
                    }
                });
            }
        });
    }

    /* =========================================
       DÉTECTION BOT
       ========================================= */

    function detectBot() {
        const userAgent = navigator.userAgent.toLowerCase();
        const bots = ['bot', 'crawler', 'spider', 'scraper', 'googlebot', 'bingbot'];
        
        const isBot = bots.some(bot => userAgent.includes(bot));
        
        if (isBot) {
            console.log('Bot detected - Skipping heavy animations');
            document.body.classList.add('bot-detected');
        }
        
        return isBot;
    }

    /* =========================================
       PRÉVENIR DOUBLE-CLICK CTA
       ========================================= */

    function preventDoubleClick() {
        const buttons = document.querySelectorAll('.btn, .btn-float');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Si déjà cliqué récemment, bloquer
                if (this.classList.contains('clicked')) {
                    e.preventDefault();
                    return false;
                }
                
                // Marquer comme cliqué
                this.classList.add('clicked');
                
                // Débloquer après 2 secondes
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 2000);
            });
        });
    }

    /* =========================================
       GESTION ERREURS
       ========================================= */

    function handleErrors() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.message, e.filename, e.lineno);
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }

    /* =========================================
       PERFORMANCE MONITORING
       ========================================= */

    function monitorPerformance() {
        // Uniquement en local/dev
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.addEventListener('load', () => {
                if (window.performance && window.performance.timing) {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                    
                    console.log('📊 Performance:');
                    console.log('  - Page load:', pageLoadTime + 'ms');
                    console.log('  - DOM ready:', domContentLoaded + 'ms');
                    
                    // Alert si trop lent
                    if (pageLoadTime > 3000) {
                        console.warn('⚠️ Page load time > 3s');
                    }
                }
            });
        }
    }

    /* =========================================
       AMÉLIORATION PROGRESSIVE
       ========================================= */

    function progressiveEnhancement() {
        // Vérifier support CSS 3D transforms
        const supportsTransform3d = () => {
            const el = document.createElement('div');
            const has3d = 'WebkitPerspective' in el.style || 'perspective' in el.style;
            return has3d;
        };
        
        if (!supportsTransform3d()) {
            console.log('3D transforms not supported - Disabling flip animations');
            document.body.classList.add('no-3d-transforms');
            
            // Désactiver les flips
            const flipCards = document.querySelectorAll('.tarot-card-flip');
            flipCards.forEach(card => {
                card.style.pointerEvents = 'none';
            });
        }
        
        // Vérifier support IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            console.log('IntersectionObserver not supported - Showing all content');
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.classList.add('visible');
            });
        }
        
        // Vérifier support requestAnimationFrame
        if (!window.requestAnimationFrame) {
            console.log('requestAnimationFrame not supported - Disabling particles');
            return false;
        }
        
        return true;
    }

    /* =========================================
       LAZY LOADING IMAGES (Fallback)
       ========================================= */

    function initLazyLoading() {
        // Polyfill pour navigateurs anciens sans support natif
        if ('loading' in HTMLImageElement.prototype) {
            // Support natif, rien à faire
            return;
        }
        
        // Fallback avec IntersectionObserver
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (!lazyImages.length) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* =========================================
       DÉTECTION SLOW CONNECTION
       ========================================= */

    function detectSlowConnection() {
        // API Network Information (expérimental)
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (connection) {
                const effectiveType = connection.effectiveType;
                
                // Si connexion lente (2G ou slow-2g)
                if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                    console.log('Slow connection detected - Reducing particles');
                    document.body.classList.add('slow-connection');
                    return true;
                }
            }
        }
        
        return false;
    }

    /* =========================================
       AJUSTEMENT DYNAMIQUE PARTICULES
       ========================================= */

    function adjustParticlesForPerformance() {
        // Réduire particules si connexion lente OU bot OU mobile bas de gamme
        const isSlowConnection = detectSlowConnection();
        const isBot = document.body.classList.contains('bot-detected');
        const isLowEndDevice = window.innerWidth < 768 && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (isSlowConnection || isBot || isLowEndDevice) {
            console.log('Performance optimization: Reducing particles');
            return Math.floor(window.innerWidth < 768 ? 40 : 80); // Moitié moins
        }
        
        return null; // Utiliser le nombre par défaut
    }




    /* =========================================
       INITIALISATION PRINCIPALE
       ========================================= */

    function init() {
        console.log('🎴 Dibassy Tarot Landing V2 - Initialized');
        console.log('📊 SEO Optimized - 2290+ words');
        
        // Détection bot
        const isBot = detectBot();
        
        // Progressive enhancement checks
        const supportsModernFeatures = progressiveEnhancement();
        
        // Gestion erreurs
        handleErrors();
        
        // Initialiser particules (sauf bots et si support modern)
        if (!isBot && supportsModernFeatures) {
            // Vérifier si on doit réduire les particules
            const customParticleCount = adjustParticlesForPerformance();
            
            if (customParticleCount === null) {
                new ParticleSystem();
            } else {
                // Version allégée
                console.log('Loading lightweight particle system');
                const particleSystem = new ParticleSystem();
                particleSystem.particleCount = customParticleCount;
                particleSystem.createParticles();
            }
        }
        
        // Initialiser toutes les fonctionnalités
        initNavigation();
        initBurgerMenu();
        initFAQ();
        initCardFlip();
        initScrollReveal();
        initSmoothScroll();
        initScrollToTop();
        initTracking();
        preventDoubleClick();
        initLazyLoading();
        
        // Performance monitoring (dev only)
        monitorPerformance();
        
        console.log('✅ All features loaded');
        console.log('📱 Mobile-first responsive: Active');
        console.log('🎯 SEO elements: H1 optimized, 8 H2 dual titles, internal links');
    }

    /* =========================================
       DÉMARRAGE
       ========================================= */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
