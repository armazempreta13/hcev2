import React, { useEffect, useRef } from 'react';

/**
 * ============================================================================
 * ANIMATED GRID BACKGROUND (SISTEMA DE PARTÍCULAS)
 * ============================================================================
 * 
 * Este componente renderiza uma malha (grid) de partículas interativas que reagem
 * ao movimento do mouse, criando um efeito tecnológico e sofisticado.
 * 
 * ----------------------------------------------------------------------------
 * INSTRUÇÕES DE IMPLEMENTAÇÃO (COMO USAR):
 * ----------------------------------------------------------------------------
 * 
 * 1. ONDE COLOCAR:
 *    Insira este componente <AnimatedGridBackground /> dentro da <section> que
 *    você deseja animar (geralmente o CTA final ou o Hero).
 * 
 * 2. REGRAS DE CSS OBRIGATÓRIAS NO PAI (<section>):
 *    O elemento pai (a section) PRECISA ter as seguintes classes Tailwind:
 *    - `relative`: Para servir de âncora para o canvas absoluto.
 *    - `overflow-hidden`: Para evitar que partículas "vazem" da tela.
 *    - `bg-primary` (ou cor escura): Para dar contraste com as partículas ciano.
 * 
 *    Exemplo:
 *    <section className="relative overflow-hidden bg-primary py-20">
 * 
 * 3. REGRAS DE Z-INDEX (MUITO IMPORTANTE):
 *    Para que os botões e textos fiquem CLICÁVEIS, eles devem estar ACIMA do canvas.
 *    
 *    - O componente <AnimatedGridBackground /> já possui `z-0`.
 *    - O container do seu conteúdo (Texto, Títulos, Botões) DEVE ter `relative z-10`.
 * 
 *    Exemplo Final:
 *    <section className="relative overflow-hidden bg-primary">
 *       <AnimatedGridBackground />  <-- Fica no fundo
 *       <div className="relative z-10 container mx-auto"> <-- Fica na frente
 *           <h1>Seu Título</h1>
 *           <button>Clique Aqui</button>
 *       </div>
 *    </section>
 * 
 * ----------------------------------------------------------------------------
 */

const AnimatedGridBackground = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Inicializamos o mouse fora da tela para não ativar o efeito no load
    const mouse = useRef({ x: -1000, y: -1000, radius: 150 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const parent = canvas.parentElement;
        
        // Se não tiver pai, não conseguimos dimensionar.
        if (!parent) return;

        // Ajusta o tamanho do canvas para bater exatamente com a Section pai
        const resizeCanvas = () => {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        };
        
        // --- CLASSE DA PARTÍCULA (FÍSICA) ---
        class Particle {
            x: number;
            y: number;
            originX: number;
            originY: number;
            size: number;
            opacity: number;
            // Vizinhos para desenhar as linhas
            neighbors: Particle[];

            constructor(x: number, y: number) {
                this.originX = x;
                this.originY = y;
                this.x = x;
                this.y = y;
                this.size = 1.5; // Tamanho base do ponto
                this.opacity = 0; // Começa invisível até interação ou proximidade
                this.neighbors = [];
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                // Cor: Cyan-400 (#22d3ee) em RGBA
                ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                // 1. Calcular distância do mouse até a origem da partícula
                const dxFromOrigin = this.originX - mouse.current.x;
                const dyFromOrigin = this.originY - mouse.current.y;
                const distFromOrigin = Math.sqrt(dxFromOrigin * dxFromOrigin + dyFromOrigin * dyFromOrigin);

                // 2. Física de Repulsão (Empurrar a partícula)
                const force = Math.max(0, mouse.current.radius - distFromOrigin);
                const angle = Math.atan2(dyFromOrigin, dxFromOrigin);
                const displacement = force * 0.5; // Força do empurrão
                
                const targetX = this.originX + Math.cos(angle) * displacement;
                const targetY = this.originY + Math.sin(angle) * displacement;
                
                // 3. Movimento Suave (Lerp / Easing)
                // Move 10% da distância restante a cada frame para criar desaceleração
                this.x += (targetX - this.x) * 0.1;
                this.y += (targetY - this.y) * 0.1;

                // 4. Calcular Opacidade baseada na proximidade do mouse
                const dxActual = this.x - mouse.current.x;
                const dyActual = this.y - mouse.current.y;
                const distanceActual = Math.sqrt(dxActual * dxActual + dyActual * dyActual);

                let targetOpacity = 0.1; // Opacidade mínima base
                let targetSize = 1.5;

                if (distanceActual < mouse.current.radius) {
                    const proximity = 1 - (distanceActual / mouse.current.radius);
                    targetOpacity = Math.max(0.1, proximity * 0.8); // Brilha mais perto do mouse
                    targetSize = 1.5 + (2 * proximity); // Fica maior perto do mouse
                }

                this.opacity += (targetOpacity - this.opacity) * 0.05;
                this.size += (targetSize - this.size) * 0.05;
            }
        }
        
        let particles: Particle[] = [];

        // --- INICIALIZAÇÃO DO GRID ---
        const init = () => {
            particles = [];
            // Espaçamento maior em desktop para performance, menor em mobile
            const spacing = window.innerWidth < 768 ? 60 : 70;
            const rows = Math.ceil(canvas.height / spacing) + 1;
            const cols = Math.ceil(canvas.width / spacing) + 1;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    particles.push(new Particle(c * spacing, r * spacing));
                }
            }
            
            // Otimização: Conectar apenas vizinhos imediatos (Direita e Baixo)
            // Isso evita loops aninhados complexos (O(n) em vez de O(n^2))
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const r = Math.floor(i / cols);
                const c = i % cols;

                if (c < cols - 1) p.neighbors.push(particles[i + 1]); // Vizinho da direita
                if (r < rows - 1) p.neighbors.push(particles[i + cols]); // Vizinho de baixo
            }
        };

        // --- LOOP DE ANIMAÇÃO (60 FPS) ---
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (const particle of particles) {
                particle.update();
                particle.draw();

                // Desenhar linhas de conexão
                for (const neighbor of particle.neighbors) {
                    // A linha herda a opacidade das partículas conectadas
                    const lineOpacity = Math.min(particle.opacity, neighbor.opacity) * 0.5;
                    
                    // Só desenha se for visível (otimização)
                    if (lineOpacity > 0.05) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.strokeStyle = `rgba(34, 211, 238, ${lineOpacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        
        // Setup inicial
        resizeCanvas();
        init();
        animate();

        // --- EVENT LISTENERS (NO PAI) ---
        // Usamos o pai para capturar o mouse, pois o canvas tem pointer-events-none
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = event.clientX - rect.left;
            mouse.current.y = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            // Move o "ímã" para longe para resetar as partículas
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };
        
        const handleResize = () => {
            cancelAnimationFrame(animationFrameId);
            resizeCanvas();
            init();
            animate();
        };

        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // As classes CSS garantem que o canvas fique no fundo e não bloqueie cliques
    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none" 
            aria-hidden="true"
        />
    );
});

export default AnimatedGridBackground;