// Efectos interactivos para el sitio web personal
// JavaScript "sabroso" con animaciones y funcionalidad

// Efecto de partículas en el fondo
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);

    // Crear partículas flotantes
    for (let i = 0; i < 30; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(139, 0, 0, 0.3);
        border-radius: 50%;
        left: ${startX}px;
        bottom: -10px;
        animation: float ${duration}s linear ${delay}s infinite;
        box-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
    `;
    
    container.appendChild(particle);
}

// Agregar animación CSS para partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .typing-effect {
        overflow: hidden;
        border-right: 3px solid #8B0000;
        white-space: nowrap;
        animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
    }

    @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
    }

    @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: #8B0000; }
    }
`;
document.head.appendChild(style);

// Efecto de escritura para títulos
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animación de cards al hacer scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(50px)';
                    entry.target.style.transition = 'all 0.6s ease-out';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => observer.observe(card));
}

// Efecto de hover en el logo
function animateLogo() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.animation = 'pulse 0.5s ease-in-out';
        });
        
        logo.addEventListener('animationend', () => {
            logo.style.animation = '';
        });
    }
}

// Validación del formulario de contacto
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        // Validación
        let isValid = true;
        let errors = [];
        
        if (nombre.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Por favor, introduce un email válido');
            isValid = false;
        }
        
        if (mensaje.length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification(errors.join('\n'), 'error');
            return;
        }
        
        // Si es válido, mostrar mensaje de éxito
        showNotification('¡Mensaje enviado con éxito! (Demo mode)', 'success');
        form.reset();
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#8B0000' : '#2a8B2a'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        white-space: pre-line;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Efecto de cursor personalizado
function customCursor() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #8B0000;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
        cursor.style.background = 'rgba(139, 0, 0, 0.2)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'transparent';
    });
}

// Contador de visitas en localStorage
function visitCounter() {
    const visits = localStorage.getItem('visitCount') || 0;
    const newVisits = parseInt(visits) + 1;
    localStorage.setItem('visitCount', newVisits);
    
    console.log(`%c¡Bienvenido! Esta es tu visita #${newVisits}`, 
                'color: #8B0000; font-size: 20px; font-weight: bold;');
}

// Efecto parallax en scroll
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Easter egg: Konami Code
function konamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === code[position]) {
            position++;
            if (position === code.length) {
                activateEasterEgg();
                position = 0;
            }
        } else {
            position = 0;
        }
    });
}

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    showNotification('🎮 ¡Código Konami activado! ¡Eres increíble!', 'success');
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Efecto de nieve (ajustado al tema rojo)
function createSnowEffect() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            const size = Math.random() * 5 + 2;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
            snowflake.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(205, 92, 92, 0.6);
                border-radius: 50%;
                left: ${startX}px;
                top: -10px;
                animation: fall ${duration}s linear ${delay}s infinite;
                pointer-events: none;
                z-index: 1;
            `;
            
            document.body.appendChild(snowflake);
        }, i * 100);
    }
    
    const fallStyle = document.createElement('style');
    fallStyle.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(fallStyle);
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎮 ¡Sitio Web Personal Cargado!', 'color: #8B0000; font-size: 24px; font-weight: bold;');
    console.log('%c💡 Tip: Prueba el código Konami (↑ ↑ ↓ ↓ ← → ← → B A)', 'color: #CD5C5C; font-size: 14px;');
    
    // Activar todas las funciones
    createParticles();
    animateOnScroll();
    animateLogo();
    setupContactForm();
    customCursor();
    visitCounter();
    parallaxEffect();
    konamiCode();
    
    // Efecto de nieve opcional (comentado por defecto)
    // createSnowEffect();
    
    // Mensaje de bienvenida con animación
    setTimeout(() => {
        showNotification('¡Bienvenido a mi sitio web! 🎉', 'success');
    }, 500);
});

// Prevenir clic derecho (opcional, comentado)
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
//     showNotification('Clic derecho deshabilitado 🔒', 'info');
// });

// Smooth scroll para todos los enlaces
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
