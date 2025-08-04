document.addEventListener('DOMContentLoaded', () => {
    // Elementos a serem animados
    const container = document.querySelector('.container');
    const musicContainer = document.querySelector('.music-container');

    // Array de elementos para animação
    const animatedElements = [container, musicContainer];

    // Definir os keyframes no JavaScript
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes moveUp {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-60px);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Configurações iniciais para cada elemento
    animatedElements.forEach(element => {
        if (element) {
            element.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            element.style.zIndex = '1';
            element.style.position = 'relative';
            element.style.willChange = 'transform';
            element.style.backfaceVisibility = 'hidden';
            element.style.transformStyle = 'preserve-3d';
            element.style.opacity = '0'; // Inicialmente invisível
        }
    });

    // Variáveis para animação vertical
    let targetYOffset = 0;
    let currentYOffset = 0;
    let rafId = null;

    function animateTransform() {
        // Interpolação suave entre posição atual e alvo
        currentYOffset += (targetYOffset - currentYOffset) * 0.05; // Suavizar movimento vertical
        
        // Aplicar transformação apenas com translateY
        if (container) {
            container.style.transform = `perspective(1000px) translateY(${currentYOffset}px)`;
        }
        
        // Para o music container, aplicar apenas perspective
        if (musicContainer && musicContainer.style.opacity === '1') {
            musicContainer.style.transform = `perspective(1000px)`;
        }
        
        // Continuar a animação sempre
        rafId = requestAnimationFrame(animateTransform);
    }

    // Iniciar a animação imediatamente
    rafId = requestAnimationFrame(animateTransform);

    // Remover eventos de movimento e rotação (tilt)
    // Não adicionar mousemove, mouseleave, mouseenter

    // Iniciar sequência de animações no clique
    document.body.addEventListener('click', () => {
        // Fade in do container principal
        if (container) {
            container.style.animation = 'fadeIn 0.8s forwards';
            
            // Quando a animação fadeIn terminar
            container.addEventListener('animationend', (e) => {
                if (e.animationName === 'fadeIn') {
                    // Remover a animação para não interferir com a transformação
                    container.style.animation = '';
                    container.style.opacity = '1';
                }
            }, { once: true });
        }

        // Adicionar um atraso para o fadeIn do music player e moveUp do container
        setTimeout(() => {
            // Fade in do music container
            if (musicContainer) {
                musicContainer.style.animation = 'fadeIn 0.8s forwards';
                
                // Quando a animação fadeIn terminar
                musicContainer.addEventListener('animationend', (e) => {
                    if (e.animationName === 'fadeIn') {
                        // Remover a animação para não interferir com a transformação
                        musicContainer.style.animation = '';
                        musicContainer.style.opacity = '1';
                    }
                }, { once: true });
            }
            
            // Move up do container principal - agora usando nossa variável targetYOffset
            if (container) {
                // Definir o deslocamento alvo para -60px
                targetYOffset = -60;
            }
        }, 2480);
    }, { once: true });
});