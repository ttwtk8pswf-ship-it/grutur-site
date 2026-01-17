/* ===================================
   GRUTUR - ECOTURISMO, LDA
   JavaScript Principal
   =================================== */

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVEGAÇÃO ==========
    initNavigation();
    
    // ========== SCROLL EFFECTS ==========
    initScrollEffects();
    
    // ========== FORMULÁRIO ==========
    initContactForm();
    
    // ========== ANIMAÇÕES ==========
    initAnimations();
    
});

/* ===================================
   NAVEGAÇÃO
   =================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mudar estilo do header ao rolar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Toggle do menu mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Navegação suave e fechar menu mobile ao clicar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adicionar classe active ao link clicado
            link.classList.add('active');
            
            // Fechar menu mobile se estiver aberto
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
            
            // Navegação suave
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Destacar link ativo baseado na posição do scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - header.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ===================================
   EFEITOS DE SCROLL
   =================================== */
function initScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Mostrar/ocultar botão de voltar ao topo
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Funcionalidade do botão voltar ao topo
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Ocultar indicador de scroll após rolar
    window.addEventListener('scroll', () => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        }
    }, { once: true });
}

/* ===================================
   FORMULÁRIO DE CONTATO
   =================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                servico: document.getElementById('servico').value,
                mensagem: document.getElementById('mensagem').value,
                data: new Date().toISOString()
            };
            
            // Validação básica
            if (!formData.nome || !formData.email || !formData.servico || !formData.mensagem) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validar email
            if (!isValidEmail(formData.email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Simular envio do formulário
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simular delay de envio
            setTimeout(() => {
                console.log('Dados do formulário:', formData);
                
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

/* ===================================
   ANIMAÇÕES DE ENTRADA
   =================================== */
function initAnimations() {
    // Intersection Observer para animações ao rolar
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll(`
        .servico-card,
        .valor-item,
        .sobre-text,
        .sobre-image,
        .stat-item,
        .info-item,
        .contato-form-wrapper
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Animação para os cards de serviço com delay
    const servicoCards = document.querySelectorAll('.servico-card');
    servicoCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Animação para os valores com delay
    const valorItems = document.querySelectorAll('.valor-item');
    valorItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
}

/* ===================================
   FUNÇÕES AUXILIARES
   =================================== */

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Remover notificações anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos inline
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#52b788' : type === 'error' ? '#ef476f' : '#40916c',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        minWidth: '300px',
        maxWidth: '500px'
    });
    
    document.body.appendChild(notification);
    
    // Adicionar animação CSS
    const style = document.createElement('style');
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
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.25rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Fechar notificação ao clicar no botão
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

// Remover notificação com animação
function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/* ===================================
   EFEITOS ADICIONAIS
   =================================== */

// Smooth scroll para todos os links com #
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Contador animado (se necessário no futuro)
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

// Log de inicialização
console.log('%cGrutur - Ecoturismo, Lda', 'color: #2d6a4f; font-size: 20px; font-weight: bold;');
console.log('%cWebsite carregado com sucesso! 🌿', 'color: #52b788; font-size: 14px;');