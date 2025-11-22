
export const CONFIG = {
    // --- Modos Globais ---
    mode: {
        maintenance: false, // true: Bloqueia o site inteiro e mostra tela de aviso
        dev: false, // Útil para logs de debug futuros
    },

    // --- Funcionalidades Principais ---
    features: {
        pricingEstimator: false, // true: Calculadora | false: Form Simples
        chatbot: true,           // true: Exibe o botão da Ester (Chatbot)
        floatingActions: true,   // true: Exibe o container flutuante (Chat + ScrollTop)
        scrollTopButton: true,   // true: Exibe o botão de voltar ao topo
    },

    // --- Marketing e Growth ---
    marketing: {
        showExitIntent: true,    // true: Mostra popup ao tentar sair (se implementado)
        showSocialAlert: true,   // true: Mostra card "Siga-nos no Instagram"
        showCookieBanner: true,  // true: Mostra aviso de LGPD
    },

    // --- Visual e Performance ---
    ui: {
        enableParticles: true,   // true: Fundo animado (pode pesar em celulares antigos)
        enableParallax: true,    // true: Efeito de profundidade ao rolar
        showLoader: true,        // true: Loader de transição de rotas
    },

    // --- Comportamento de Conversão ---
    behavior: {
        directWhatsApp: false,   // true: Botões "Orçamento" vão direto pro Zap | false: Vão para /contato
        openLinksInNewTab: true, // true: Links externos abrem em nova aba
    },

    // --- Configurações de Páginas ---
    pages: {
        home: {
            showStats: true,        // Seção de contadores (Projetos entregues, etc)
            showTeamCarousel: true, // Carrossel de fotos da equipe/obras
        },
        team: {
            showCareers: true,      // Seção "Trabalhe Conosco"
            openPositions: false    // true: Lista vagas | false: Mensagem "Sem vagas"
        }
    }
};
