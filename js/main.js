/* ===================================
   Grutur - Ecoturismo, Lda
   JavaScript - Interatividade e Animações
   =================================== */

// === NAVEGAÇÃO MOBILE ===
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Abrir menu mobile
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Fechar menu mobile
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// === HEADER SCROLL ===
function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader);

// === NAVEGAÇÃO ATIVA POR SEÇÃO ===
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            correspondingLink?.classList.add('active');
        } else {
            correspondingLink?.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', scrollActive);

// === SCROLL SUAVE ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === BOTÃO SCROLL TO TOP ===
const scrollTopBtn = document.getElementById('scroll-top');

function scrollTop() {
    if (window.scrollY >= 560) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}
window.addEventListener('scroll', scrollTop);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// === ANIMAÇÕES AO SCROLL (Intersection Observer) ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
const animateElements = document.querySelectorAll('.service__card, .value__card, .about__content, .contact__container');
animateElements.forEach(el => observer.observe(el));

// === FORMULÁRIO DE CONTATO ===
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

function showNotification(message, duration = 3000) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Validação básica
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um e-mail válido.');
            return;
        }
        
        // Simular envio de formulário
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Limpar formulário
        contactForm.reset();
        
        // Em produção, aqui você faria uma requisição real para enviar o formulário
        // Exemplo com fetch:
        /*
        fetch('sua-url-de-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, message })
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Mensagem enviada com sucesso!');
            contactForm.reset();
        })
        .catch(error => {
            showNotification('Erro ao enviar mensagem. Tente novamente.');
        });
        */
    });
}

// === VALIDAÇÃO EM TEMPO REAL DOS INPUTS ===
const formInputs = document.querySelectorAll('.form__input');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '';
    });
});

// === EFEITO PARALLAX NO HERO ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero__image i');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// === CONTADORES ANIMADOS (se quiser adicionar estatísticas) ===
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// === LAZY LOADING DE IMAGENS ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// === PREVENÇÃO DE SCROLL HORIZONTAL ===
function preventHorizontalScroll() {
    const scrollX = window.scrollX;
    if (scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
    }
}
window.addEventListener('scroll', preventHorizontalScroll);

// === DETECÇÃO DE DEVICE ===
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustes específicos para mobile
if (isMobile()) {
    document.body.classList.add('mobile-device');
}

// === LOADING STATE ===
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animação inicial dos elementos visíveis
    const initialElements = document.querySelectorAll('.hero__content, .hero__image');
    initialElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// === TRATAMENTO DE ERROS GLOBAL ===
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
    // Em produção, você pode enviar erros para um serviço de logging
});

// === SERVICE WORKER (PWA - Opcional) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Descomentar quando tiver um service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registrado:', registration))
            .catch(error => console.log('SW falhou:', error));
        */
    });
}

// === PERFORMANCE MONITORING ===
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Tempo de carregamento da página: ${pageLoadTime}ms`);
        }, 0);
    });
}

// === ACESSIBILIDADE - NAVEGAÇÃO POR TECLADO ===
document.addEventListener('keydown', (e) => {
    // ESC para fechar menu mobile
    if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
    }
    
    // Tab trap no menu mobile quando aberto
    if (e.key === 'Tab' && navMenu.classList.contains('show-menu')) {
        const focusableElements = navMenu.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// === CONFIGURAÇÕES GERAIS ===
const siteConfig = {
    animationSpeed: 300,
    scrollOffset: 100,
    notificationDuration: 3000,
    lazyLoadOffset: '50px'
};

// === UTILITÁRIOS ===
const utils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
};

// === INICIALIZAÇÃO ===
console.log('✅ Grutur - Ecoturismo, Lda - Website carregado com sucesso!');
console.log('🌿 Tema: Verde Natureza');
console.log('📱 Responsivo: Ativo');
console.log('⚡ JavaScript: Funcional');
