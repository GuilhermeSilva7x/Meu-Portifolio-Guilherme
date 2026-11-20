/* ===================================================
   PORTFÓLIO GUILHERME SILVA - SCRIPTS & INTERATIVIDADE
   RESPONSIVO PARA CELULAR & DESKTOP
   =================================================== */

// CONFIGURAÇÃO DO SCROLLREVEAL
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        reset: false,
        distance: '35px',
        duration: 850,
        delay: 100,
        easing: 'cubic-bezier(0.5, 0, 0, 1)'
    });

    sr.reveal('.chip-status-pro', { origin: 'top', delay: 100 });
    sr.reveal('.avatar-arena', { origin: 'top', delay: 200 });
    sr.reveal('.hero-titulo', { origin: 'bottom', delay: 300 });
    sr.reveal('.hero-subtitulo', { origin: 'bottom', delay: 400 });
    sr.reveal('.hero-botoes', { origin: 'bottom', delay: 500 });
    sr.reveal('.hero-redes', { origin: 'bottom', delay: 600 });

    sr.reveal('.secao-cabecalho', { origin: 'top', distance: '30px' });
    sr.reveal('.card-glass-master', { origin: 'bottom', delay: 150 });
    sr.reveal('.card-pilar-3d', { origin: 'bottom', interval: 120, delay: 180 });
    sr.reveal('.card-habilidade-pro', { origin: 'bottom', interval: 100, delay: 150 });
    sr.reveal('.card-projeto-master', { origin: 'bottom', interval: 150, delay: 150 });
    sr.reveal('.btn-rede-moderno', { origin: 'bottom', interval: 80, delay: 150 });
    sr.reveal('#formulario', { origin: 'bottom', delay: 200 });
}

// INICIALIZAÇÃO AO CARREGAR O DOM
document.addEventListener("DOMContentLoaded", function () {
    // 1. Carregar preferência salva do tema (Claro / Escuro)
    carregarPreferenciaTema();

    // 2. Atualizar ano no rodapé
    const elementoAno = document.getElementById("ano-atual");
    if (elementoAno) {
        elementoAno.innerText = new Date().getFullYear();
    }

    // 3. Fundo Tecnológico Dinâmico (Stream de Código & Rede de Dados)
    iniciarCanvasTech();

    // 4. Efeito 3D Tilt nos Cards (Apenas em telas com mouse / Desktop)
    iniciarEfeitoTiltDesktop();

    // 5. ScrollSpy sincronizado (Desktop + Dock Inferior Mobile)
    iniciarScrollSpy();
});

// MOTOR DE STREAM DE CÓDIGO & REDE DE DADOS 3D (CANVAS)
// Substitui degradês por elementos tecnológicos reais flutuando no fundo
function iniciarCanvasTech() {
    const canvas = document.getElementById("canvas-tech-stream");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let largura, altura;
    let particulas = [];
    const simbolosTech = ["</>", "{ }", "git", "0101", "const", "async", "=>", "API", "npm", "SQL", "JS", "TS", "npm run", "class"];

    function redimensionar() {
        largura = canvas.width = window.innerWidth;
        altura = canvas.height = window.innerHeight;
        criarParticulas();
    }

    function criarParticulas() {
        particulas = [];
        const ehMobile = window.innerWidth < 768;
        const total = ehMobile ? 22 : 45;

        for (let i = 0; i < total; i++) {
            const ehTexto = Math.random() > 0.45;
            particulas.push({
                x: Math.random() * largura,
                y: Math.random() * altura,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -(Math.random() * 0.5 + 0.2), // flutua suavemente para cima
                tipo: ehTexto ? "texto" : "ponto",
                texto: simbolosTech[Math.floor(Math.random() * simbolosTech.length)],
                tamanho: ehTexto ? (ehMobile ? 11 : 13) : Math.random() * 2 + 1,
                alpha: Math.random() * 0.45 + 0.15,
                alphaVelocidade: (Math.random() - 0.5) * 0.005
            });
        }
    }

    function animar() {
        ctx.clearRect(0, 0, largura, altura);

        // 1. Linhas de conexão sutis entre partículas próximas
        const distanciaMaxima = window.innerWidth < 768 ? 85 : 120;
        for (let i = 0; i < particulas.length; i++) {
            for (let j = i + 1; j < particulas.length; j++) {
                const dx = particulas[i].x - particulas[j].x;
                const dy = particulas[i].y - particulas[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < distanciaMaxima) {
                    const opacidade = (1 - dist / distanciaMaxima) * 0.12;
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacidade})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(particulas[j].x, particulas[j].y);
                    ctx.stroke();
                }
            }
        }

        // 2. Desenha cada símbolo de tecnologia ou nó da rede
        particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += p.alphaVelocidade;

            if (p.alpha <= 0.1 || p.alpha >= 0.6) {
                p.alphaVelocidade *= -1;
            }

            if (p.y < -25) {
                p.y = altura + 25;
                p.x = Math.random() * largura;
            }
            if (p.x < -25) p.x = largura + 25;
            if (p.x > largura + 25) p.x = -25;

            if (p.tipo === "texto") {
                ctx.font = `600 ${p.tamanho}px 'Fira Code', monospace`;
                ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
                ctx.fillText(p.texto, p.x, p.y);
            } else {
                ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(animar);
    }

    window.addEventListener("resize", redimensionar);
    redimensionar();
    animar();
}

// MOTOR DE EFEITO 3D TILT (DESKTOP)
function iniciarEfeitoTiltDesktop() {
    // Se for dispositivo touch (celular), não ativa o tilt para evitar travamento no toque
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cardsTilt = document.querySelectorAll(".tilt-card");

    cardsTilt.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xCentral = rect.width / 2;
            const yCentral = rect.height / 2;

            const rotX = ((y - yCentral) / yCentral) * -8;
            const rotY = ((x - xCentral) / xCentral) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            card.style.transition = "transform 0.4s ease";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.1s ease";
        });
    });
}

// ALTERNAR TEMA CLARO / ESCURO
function alternarTema() {
    const corpo = document.body;
    const iconeTema = document.getElementById("icone-tema");
    const textoTema = document.getElementById("texto-tema");

    corpo.classList.toggle("modo-claro");
    const ehModoClaro = corpo.classList.contains("modo-claro");

    if (ehModoClaro) {
        if (iconeTema) iconeTema.innerText = "☀️";
        if (textoTema) textoTema.innerText = "Modo Claro";
        localStorage.setItem("tema-portfolio", "claro");
    } else {
        if (iconeTema) iconeTema.innerText = "🌙";
        if (textoTema) textoTema.innerText = "Modo Noturno";
        localStorage.setItem("tema-portfolio", "escuro");
    }
}

// CARREGAR PREFERÊNCIA DO TEMA
function carregarPreferenciaTema() {
    const temaSalvo = localStorage.getItem("tema-portfolio");
    const iconeTema = document.getElementById("icone-tema");
    const textoTema = document.getElementById("texto-tema");

    if (temaSalvo === "claro") {
        document.body.classList.add("modo-claro");
        if (iconeTema) iconeTema.innerText = "☀️";
        if (textoTema) textoTema.innerText = "Modo Claro";
    } else {
        document.body.classList.remove("modo-claro");
        if (iconeTema) iconeTema.innerText = "🌙";
        if (textoTema) textoTema.innerText = "Modo Noturno";
    }
}

// SCROLLSPY SINCRONIZADO (DESKTOP + DOCK INFERIOR MOBILE)
function iniciarScrollSpy() {
    const secoes = document.querySelectorAll("main[id], section[id]");
    const linksDesktop = document.querySelectorAll(".dock-link");
    const linksMobile = document.querySelectorAll(".dock-item");

    if (!secoes.length) return;

    window.addEventListener("scroll", function () {
        let scrollY = window.pageYOffset;

        secoes.forEach(secao => {
            const secaoAltura = secao.offsetHeight;
            const secaoTopo = secao.offsetTop - 140;
            const secaoId = secao.getAttribute("id");

            if (scrollY >= secaoTopo && scrollY < secaoTopo + secaoAltura) {
                // Atualiza links do menu superior Desktop
                linksDesktop.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${secaoId}`) {
                        link.classList.add("active");
                    }
                });

                // Atualiza links da barra dock inferior do Celular
                linksMobile.forEach(item => {
                    item.classList.remove("active");
                    if (item.getAttribute("href") === `#${secaoId}`) {
                        item.classList.add("active");
                    }
                });
            }
        });
    });
}

// ENVIO DE MENSAGEM NO WHATSAPP COM VALIDAÇÃO
function enviarWhats(event) {
    event.preventDefault();

    const campoNome = document.getElementById("nome");
    const campoMensagem = document.getElementById("mensagem");

    if (!campoNome || !campoMensagem) return;

    const nome = campoNome.value.trim();
    const mensagem = campoMensagem.value.trim();

    if (!nome || !mensagem) {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return;
    }

    const telefone = "5564992517948"; // Seu número oficial configurado

    const texto = `Olá! Meu nome é *${nome}*.\n\n${mensagem}`;
    const msgFormatada = encodeURIComponent(texto);
    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;

    window.open(url, "_blank");
}
