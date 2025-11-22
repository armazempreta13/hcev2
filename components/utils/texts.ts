/**
 * ============================================================================
 * CENTRAL DE TEXTOS (COPYWRITING)
 * ============================================================================
 * 
 * Este arquivo contém TODO o conteúdo textual do site.
 * 
 * OBJETIVO:
 * - Facilitar a edição de textos sem mexer no código.
 * - Permitir futura internacionalização (i18n).
 * - Manter consistência no tom de voz da marca.
 * 
 * ESTRUTURA:
 * O objeto TEXTS está dividido por páginas e componentes.
 */

export const TEXTS = {
    // ========================================================================
    // 1. GLOBAL & METADATA
    // ========================================================================
    global: {
        brandName: 'HCE Esquadrias',
        brandSlogan: 'A Arte da Precisão',
        contact: {
            phoneDisplay: '(61) 9 9361-9554',
            email: 'hceesquadrias@yahoo.com',
            address: 'Brasília - DF, Brasil',
            addressDetails: 'Atendemos em todo o Distrito Federal e entorno.',
            hours: {
                weekdays: 'Segunda a Sexta: 08h às 18h',
                saturday: 'Sábado: 08h às 12h',
                short: 'Seg. a Sex. | 08h às 18h'
            }
        },
        buttons: {
            budget: 'Orçamento',
            requestBudget: 'Solicitar Orçamento',
            startProject: 'Iniciar Projeto',
            viewWork: 'Ver Trabalhos',
            learnMore: 'Saiba mais',
            sendMessage: 'Enviar Mensagem',
            whatsapp: 'WhatsApp',
            email: 'Enviar E-mail',
            backHome: 'Voltar para a Home',
            close: 'Fechar',
            send: 'Enviar',
            loading: 'Carregando...',
            next: 'Próximo',
            prev: 'Anterior',
            seeMore: 'Ver mais'
        }
    },

    // ========================================================================
    // 2. HEADER (CABEÇALHO)
    // ========================================================================
    header: {
        nav: {
            home: 'Home',
            about: 'Sobre Nós',
            services: 'Serviços',
            portfolio: 'Portfólio',
            team: 'Equipe',
        }
    },

    // ========================================================================
    // 3. FOOTER (RODAPÉ)
    // ========================================================================
    footer: {
        description1: 'HCE Esquadrias - Especialistas em Alumínio.',
        description2: 'Precisão e design que transformam ambientes.',
        titles: {
            navigation: 'Navegação',
            contact: 'Contato',
            followUs: 'Siga-nos',
            serviceHours: 'Atendimento',
            partners: 'Nossos Parceiros e Certificações'
        },
        links: {
            privacy: 'Política de Privacidade',
            terms: 'Termos de Uso'
        },
        copyright: 'Todos os direitos reservados.'
    },

    // ========================================================================
    // 4. HOME PAGE
    // ========================================================================
    home: {
        hero: {
            preTitle: 'HCE Esquadrias',
            title: 'Arquitetura em Alumínio',
            description: 'Transformamos metal em arte. Cada projeto é uma assinatura de precisão, tecnologia e design atemporal.'
        },
        stats: {
            delivered: 'Projeto Entregue', // Singular/Plural trick handled in component or generic text
            precision: 'Precisão nos Detalhes',
            satisfaction: 'Satisfação Garantida',
            professionals: 'Profissionais Dedicados'
        },
        servicesIntro: {
            label: 'Nossas Especialidades',
            title: 'Soluções Completas',
            description: 'Expertise técnica aliada ao design contemporâneo para elevar seus projetos.'
        },
        portfolioIntro: {
            label: 'Portfólio',
            title: 'Obras que Definem Padrões',
            description: 'Cada instalação reflete nosso compromisso inabalável com a qualidade. Descubra projetos que transformaram espaços em referências.'
        },
        teamIntro: {
            title: 'Nossa Equipe em Ação',
            description: 'Nosso diferencial está na precisão de cada corte e na dedicação de nossa equipe. Veja os bastidores de como transformamos alumínio em obras de arte.'
        },
        cta: {
            title: 'Pronto para Criar Algo Excepcional?',
            description: 'Cada projeto começa com uma conversa. Vamos transformar sua visão em realidade com a precisão que só o alumínio da HCE pode oferecer.',
            buttonCall: 'Ligar Agora'
        }
    },

    // ========================================================================
    // 5. SERVICES PAGE
    // ========================================================================
    services: {
        header: {
            title: 'Engenharia em Alumínio',
            description: 'Cada serviço que oferecemos é executado com precisão milimétrica e um compromisso inabalável com a qualidade, desde a concepção até a instalação final.'
        },
        items: {
            esquadrias: {
                title: 'Esquadrias de Alumínio Premium',
                description: 'Desenvolvemos portas e janelas sob medida que são o coração de projetos arquitetônicos. Utilizando principalmente a linha Inova, garantimos não apenas um design impecável, mas também uma performance termoacústica superior, segurança e durabilidade que resistem ao tempo.',
                features: ['Isolamento Acústico e Térmico', 'Segurança Reforçada', 'Design Personalizado', 'Durabilidade e Baixa Manutenção']
            },
            brises: {
                title: 'Ripados e Brises de Alumínio',
                description: 'Elementos arquitetônicos que proporcionam controle solar, privacidade e um forte apelo estético. Nossos ripados e brises são fabricados com precisão para se adaptarem a fachadas e ambientes internos, adicionando textura e modernidade ao projeto.',
                features: ['Controle de Luminosidade', 'Privacidade e Ventilação', 'Estética Contemporânea', 'Personalização de Cores e Acabamentos']
            },
            guardaCorpo: {
                title: 'Guarda-corpos de Alumínio e Vidro',
                description: 'Unimos segurança e elegância em nossos guarda-corpos. Ideais para sacadas, escadas, mezaninos e áreas de piscina, eles oferecem proteção sem obstruir a visão, integrando-se perfeitamente ao design do ambiente com um visual leve e sofisticado.',
                features: ['Segurança Conforme Normas ABNT', 'Design Clean e Minimalista', 'Alta Resistência a Intempéries', 'Visão Panorâmica Desobstruída']
            },
            peleVidro: {
                title: 'Pele de Vidro e Fachadas Glazing',
                description: 'Transformamos a fachada de edifícios com o sistema de Pele de Vidro (Structural Glazing), criando uma estética limpa, moderna e imponente. Esta solução maximiza a iluminação natural, valoriza o imóvel e reflete o que há de mais avançado na arquitetura contemporânea.',
                features: ['Estética Minimalista e Moderna', 'Otimização da Luz Natural', 'Eficiência Energética', 'Valorização do Imóvel']
            }
        },
        typesSection: {
            title: 'Nossas Soluções em Esquadrias',
            description: 'Descubra a solução ideal para cada ambiente do seu projeto, combinando funcionalidade, design e a mais alta performance.',
            items: [
                { title: 'Janelas de Correr', desc: 'Versáteis e funcionais, otimizam o espaço e permitem ampla abertura para ventilação e luminosidade.' },
                { title: 'Janelas Maxim-ar', desc: 'Ideal para banheiros e cozinhas, permite ventilação controlada mesmo em dias de chuva, com design prático.' },
                { title: 'Portas de Correr', desc: 'Integram ambientes com elegância, economizando espaço e proporcionando grandes vãos de passagem e iluminação.' },
                { title: 'Portas Pivotantes', desc: 'Uma declaração de design e sofisticação para entradas, com um sistema de abertura imponente e moderno.' },
                { title: 'Esquadrias Fixas', desc: 'Perfeitas para valorizar vistas panorâmicas e aumentar a entrada de luz natural em locais onde a ventilação não é necessária.' },
                { title: 'Portões de Alumínio', desc: 'Segurança, durabilidade e design em portões de garagem e de entrada, disponíveis em modelos basculantes, deslizantes e pivotantes.' }
            ]
        },
        cta: {
            title: 'Pronto para Elevar seu Projeto?',
            description: 'Nossa equipe está pronta para transformar sua visão em realidade com soluções personalizadas e de alta performance.'
        }
    },

    // ========================================================================
    // 6. ABOUT PAGE
    // ========================================================================
    about: {
        hero: {
            title: 'A Arte da Precisão',
            description: 'Nascemos para unir engenharia e design, criando esquadrias de alumínio que definem novos padrões de qualidade e inovação.'
        },
        history: {
            title: 'Nossa História',
            paragraphs: [
                'Fundada em 2024, a HCE Esquadrias é o resultado de mais de 25 anos de experiência de seu sócio-fundador, Hércules, no setor de esquadrias. Nascemos da paixão pela engenharia de precisão, com um foco singular: dominar a arte de transformar o alumínio em soluções arquitetônicas.',
                'Apesar de sermos uma empresa nova, nossa base é a vasta experiência prática e técnica. Não somos generalistas; somos artesãos dedicados a transformar projetos em realidade com a máxima qualidade, durabilidade e um olhar inovador.',
                'Com atuação focada em Brasília e região, nosso objetivo é construir uma reputação de confiança junto a arquitetos, engenheiros e clientes finais que não abrem mão da excelência. Cada projeto é um compromisso com a perfeição, desde a escolha do perfil de alumínio até a instalação final.'
            ]
        },
        pillars: {
            title: 'Nossos Pilares',
            mission: { title: 'Missão', text: 'Entregar soluções em esquadrias de alumínio que superem as expectativas em design, performance e durabilidade.' },
            vision: { title: 'Visão', text: 'Ser a referência em esquadrias de alto padrão, reconhecida pela precisão técnica, inovação e excelência no atendimento.' },
            values: { title: 'Valores', text: 'Qualidade, Precisão, Segurança, Confiança, Inovação e Parceria.' }
        },
        safety: {
            title: 'Segurança em Primeiro Lugar',
            description: 'Nosso compromisso com a segurança é inegociável. Seguimos rigorosamente as Normas Regulamentadoras para garantir a integridade da nossa equipe e a excelência em cada projeto.'
        },
        cta: {
            title: 'Construa o Futuro Conosco',
            description: 'Seja para um projeto residencial ou corporativo, nossa equipe está pronta para entregar a excelência que você busca.'
        }
    },

    // ========================================================================
    // 7. PORTFOLIO PAGE
    // ========================================================================
    portfolio: {
        header: {
            title: 'Projetos que Inspiram',
            description: 'Navegue por nossa galeria e veja a precisão e o design da HCE em ação. Cada projeto é um testemunho da nossa capacidade de transformar espaços com alumínio de alta performance.'
        },
        filters: {
            all: 'Todos',
            residential: 'Residencial',
            commercial: 'Comercial',
            industrial: 'Industrial'
        },
        modal: {
            techSpecs: 'Ficha Técnica'
        },
        cta: {
            title: 'Gostou do que Viu?',
            description: 'Sua visão, nossa expertise. Vamos conversar sobre como podemos elevar seu próximo projeto com soluções em alumínio de alto padrão.'
        }
    },

    // ========================================================================
    // 8. TEAM PAGE
    // ========================================================================
    team: {
        header: {
            title: 'Nossa Força, Nossa Gente',
            description: 'Conheça os especialistas que dedicam seu talento e precisão para transformar projetos em realidade.'
        },
        leadership: {
            title: 'Liderança',
            description: 'A união entre técnica e gestão que define a essência da HCE.',
            bios: {
                hercules: "A força técnica e a experiência de 25 anos que originou o 'H' da nossa marca.",
                cleide: "A gestão humana e estratégica que compõe o 'CE' da nossa identidade."
            }
        },
        specialists: {
            title: 'Time de Especialistas'
        },
        careers: {
            available: {
                title: 'Faça Parte da Nossa Equipe',
                description: 'Buscamos talentos apaixonados por precisão e qualidade para crescer conosco e continuar transformando a arquitetura em Brasília.',
                label: 'Vagas Abertas',
                button: 'Candidatar-se',
                buttonContinue: 'Continuar Candidatura'
            },
            unavailable: {
                title: 'Carreiras na HCE',
                description: 'Agradecemos o seu interesse em fazer parte da HCE Esquadrias. No momento, não temos vagas abertas, mas nosso time está sempre crescendo. Fique de olho nesta página para futuras oportunidades.',
                boxTitle: 'Nosso Time Está Completo',
                boxText: 'Agradecemos o seu interesse em fazer parte da HCE Esquadrias. No momento, nossa equipe está completa e não estamos aceitando novos currículos. Fique de olho nesta página para futuras oportunidades!'
            }
        }
    },

    // ========================================================================
    // 9. CONTACT PAGE & PRICING
    // ========================================================================
    contact: {
        pricingPage: {
            header: {
                title: 'Orçamento Rápido e Transparente',
                description: 'Esta é a ferramenta exclusiva da HCE. Simule o custo do seu projeto em segundos e entenda onde seu investimento está sendo aplicado.'
            },
            steps: {
                one: '1. Qual serviço você precisa?',
                two: '2. Qual a área aproximada?',
                three: '3. Qual o nível de acabamento?',
                four: 'Próximo Passo',
                areaLabel: 'Área do Projeto:'
            },
            nextStepText: 'Gostou da estimativa? Preencha seus dados abaixo para que nossa equipe entre em contato, agende uma visita técnica e formalize sua proposta detalhada.',
            buttonCalculate: 'Receber Proposta Detalhada',
            form: {
                nameLabel: 'Seu Nome Completo',
                phoneLabel: 'Seu WhatsApp',
                whatsappButton: 'Enviar para WhatsApp'
            },
            resultCard: {
                waitingTitle: 'Aguardando seu projeto',
                waitingDesc: 'Use os controles para nos contar sobre sua ideia e veja a mágica acontecer.',
                title: 'Sua Estimativa Rápida',
                estimatedValue: 'Valor Estimado',
                disclaimer: 'Este é um valor aproximado.',
                detailsTitle: 'Detalhamento da Estimativa:',
                materialCost: 'Custo com Materiais',
                laborCost: 'Custo com Mão de Obra',
                deadline: 'Prazo de Execução Estimado',
                finalDisclaimer: 'Valores baseados em nossa experiência e custos atuais. O orçamento final será confirmado após visita técnica e alinhamento de todos os detalhes.'
            }
        },
        simplePage: {
            header: {
                title: 'Fale Conosco',
                description: 'Estamos prontos para atender você. Envie sua mensagem ou solicitação de orçamento diretamente para nossa equipe.'
            },
            channels: {
                title: 'Canais de Atendimento',
                whatsapp: { title: 'WhatsApp', desc: 'Atendimento rápido e direto.' },
                email: { title: 'E-mail', desc: 'Para envio de projetos e documentos.' },
                location: { title: 'Localização', desc: 'Brasília - DF' }
            },
            form: {
                title: 'Envie uma Mensagem',
                namePlaceholder: 'Seu nome',
                phonePlaceholder: '(XX) XXXXX-XXXX',
                msgLabel: 'Como podemos ajudar?',
                msgPlaceholder: 'Descreva sua dúvida ou solicitação de orçamento...',
                button: 'Enviar no WhatsApp'
            }
        }
    },

    // ========================================================================
    // 10. PRICING ESTIMATOR CONSTANTS
    // ========================================================================
    pricing: {
        services: {
            windows_doors: 'Janelas e Portas',
            facades: 'Fachadas / Pele de Vidro',
            railings: 'Guarda-Corpos',
            brises: 'Ripados e Brises'
        },
        quality: {
            standard: { name: 'Padrão', desc: 'Qualidade HCE com perfis e vidros eficientes.' },
            premium: { name: 'Sofisticado', desc: 'Perfis mais robustos e vidros com maior performance.' },
            luxury: { name: 'Luxo', desc: 'Soluções de ponta, vidros especiais e acabamentos exclusivos.' }
        }
    },

    // ========================================================================
    // 11. SYSTEM / ALERTS / MODALS
    // ========================================================================
    maintenance: {
        title: 'Em Manutenção',
        description: 'Estamos atualizando nosso ambiente digital para oferecer uma experiência ainda melhor, com a precisão e qualidade que você já conhece.',
        footer: 'Voltaremos em breve. Enquanto isso, fale conosco diretamente:'
    },
    
    cookieBanner: {
        textDesktop: 'Sua privacidade importa. Utilizamos cookies para aprimorar sua experiência. Ao continuar, você concorda com nossa Política de Privacidade.',
        textMobile: 'Usamos cookies para melhorar sua experiência.',
        buttons: {
            customize: 'Personalizar',
            accept: 'Aceitar',
            acceptAll: 'Aceitar Tudo',
            necessary: 'Necessários'
        }
    },

    cookieModal: {
        title: 'Preferências de Cookies',
        description: 'Gerencie suas preferências de consentimento. Você pode habilitar ou desabilitar os diferentes tipos de cookies abaixo.',
        sections: {
            necessary: { title: 'Necessários', desc: 'Essenciais para o funcionamento do site (segurança, preferências de cookies).' },
            analytics: { title: 'Analíticos', desc: 'Nos ajudam a melhorar o site analisando as estatísticas de uso (Google Analytics).' },
            functional: { title: 'Funcionais', desc: 'Permitem funcionalidades aprimoradas, como salvar o histórico do chat.' },
            marketing: { title: 'Marketing', desc: 'Usados para exibir anúncios relevantes (Google Ads).' }
        },
        buttons: {
            cancel: 'Cancelar',
            save: 'Salvar Preferências'
        }
    },

    socialAlert: {
        title: 'Acompanhe nossas obras',
        description: 'Siga a HCE no Instagram e veja os bastidores.',
        buttonFollow: 'Seguir',
        buttonLater: 'Depois',
        mobileText: 'Siga @hce_esquadrias'
    },

    exitPopup: {
        title: 'Opa, já está de saída?',
        description: 'Se tiver qualquer dúvida, nosso assistente virtual pode ajudar agora mesmo. Que tal tentar?',
        buttonChat: 'Abrir Chat',
        buttonNo: 'Não, obrigado'
    },

    notFound: {
        title: 'Página Não Encontrada',
        description: 'Oops! Parece que o caminho que você procurava não existe. Vamos encontrar uma janela de oportunidade e voltar para o início.'
    }
};