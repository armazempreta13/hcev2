/**
 * ============================================================================
 * CENTRAL DE IMAGENS E VÍDEOS (ASSETS)
 * ============================================================================
 * 
 * Este arquivo contém TODAS as referências de imagens e vídeos utilizados no site.
 * 
 * MOTIVO:
 * - Facilita a manutenção: Troque a URL aqui e atualize no site todo.
 * - Organização: Sabemos exatamente onde cada imagem está sendo usada.
 * - Cache e Performance: URLs centralizadas facilitam estratégias de preload.
 * 
 * ESTRUTURA:
 * O objeto IMAGES está dividido por seções (logos, home, services, etc.) para
 * facilitar a busca.
 */

export const IMAGES = {
    // ========================================================================
    // 1. IDENTIDADE VISUAL E ÍCONES GERAIS
    // ========================================================================
    identity: {
        /** Logo Principal (Azul/Escura) - Usada no Header Desktop, Tela de Manutenção */
        logoColor: 'https://i.imgur.com/wwhgVHu.png',
        
        /** Logo Branca/Clara - Usada no Footer, Menu Mobile, Chatbot, Loader e Favicon */
        logoWhite: 'https://i.imgur.com/spMimAM.png',
        
        /** Ícone de Carregamento (Loader) - Versão simplificada ou símbolo */
        loaderSymbol: 'https://i.imgur.com/vSSLyD5.png',
        
        /** Imagem "A Arte da Precisão" - Seção hero/destaque */
        arteDaPrecisao: 'https://i.imgur.com/ArteDP01.jpeg',
    },

    // ========================================================================
    // 2. HOME PAGE (PÁGINA INICIAL)
    // ========================================================================
    home: {
        hero: {
            /** Imagens do efeito Parallax na primeira dobra (Hero Section) */
            parallax1: 'https://i.imgur.com/uDRif7Ql.jpeg', // Imagem de fundo/trás
            parallax2: 'https://i.imgur.com/f048dG5l.jpeg', // Imagem do meio
            parallax3: 'https://i.imgur.com/Xp9pynVl.jpeg', // Imagem da frente (destaque)
        },
        
        servicesPreview: {
            /** Imagens dos cards de serviços na Home */
            esquadrias: 'https://i.imgur.com/YgT81p4l.jpeg',
            brises: 'https://i.imgur.com/AQsR2Jml.jpeg',
            guardaCorpo: 'https://i.imgur.com/pZqTVmGl.jpeg',
            peleVidro: 'https://i.imgur.com/kSj9d2vl.jpeg',
        },

        cta: {
            /** Background da seção "Pronto para Criar Algo Excepcional?" */
            background: 'https://i.imgur.com/FzIPeCH.jpeg',
        },
        
        /** 
         * Galeria Rotativa (Carrossel) da Home
         * Contém vídeos e imagens misturados.
         * Nomenclatura: type (tipo), src (url principal), thumb (miniatura para carregamento rápido)
         */
        carousel: [
            { type: 'video', src: 'https://i.imgur.com/fQW4PeG.mp4', thumb: 'https://i.imgur.com/fQW4PeGm.jpg', alt: 'Processo de corte de alumínio' },
            { type: 'video', src: 'https://i.imgur.com/mfivPrk.mp4', thumb: 'https://i.imgur.com/mfivPrkm.jpg', alt: 'Instalação de janela' },
            { type: 'image', src: 'https://i.imgur.com/Wb93S7K.jpeg', thumb: 'https://i.imgur.com/Wb93S7Km.jpg', alt: 'Detalhe de acabamento' },
            { type: 'video', src: 'https://i.imgur.com/ew22VEF.mp4', thumb: 'https://i.imgur.com/ew22VEFm.jpg', alt: 'Transporte de vidro' },
            { type: 'image', src: 'https://i.imgur.com/nesEH1I.jpeg', thumb: 'https://i.imgur.com/nesEH1Im.jpg', alt: 'Medição técnica' },
            { type: 'video', src: 'https://i.imgur.com/nYx4IzO.mp4', thumb: 'https://i.imgur.com/nYx4IzOm.jpg', alt: 'Serralheiro trabalhando' },
            { type: 'video', src: 'https://i.imgur.com/HSc3VmK.mp4', thumb: 'https://i.imgur.com/HSc3VmKm.jpg', alt: 'Porta de correr abrindo' },
            { type: 'video', src: 'https://i.imgur.com/GtEpOLh.mp4', thumb: 'https://i.imgur.com/GtEpOLhm.jpg', alt: 'Montagem pele de vidro' },
            { type: 'image', src: 'https://i.imgur.com/LrvXdiN.jpeg', thumb: 'https://i.imgur.com/LrvXdiNm.jpg', alt: 'Equipe em reunião' },
            { type: 'video', src: 'https://i.imgur.com/JUvwwe3.mp4', thumb: 'https://i.imgur.com/JUvwwe3m.jpg', alt: 'Usinagem de alumínio' },
            { type: 'video', src: 'https://i.imgur.com/0lBXcZd.mp4', thumb: 'https://i.imgur.com/0lBXcZdm.jpg', alt: 'Finalização guarda-corpo' },
            { type: 'video', src: 'https://i.imgur.com/yUHdSA7.mp4', thumb: 'https://i.imgur.com/yUHdSA7m.jpg', alt: 'Fachada com brises' },
        ]
    },

    // ========================================================================
    // 3. PÁGINA DE SERVIÇOS
    // ========================================================================
    services: {
        details: {
            /** Imagens grandes detalhando cada serviço */
            esquadrias: 'https://i.imgur.com/vSSLyD5l.png',
            brises: 'https://i.imgur.com/phVat4Zl.jpeg',
            guardaCorpo: 'https://i.imgur.com/Mw9Sn5Yl.jpeg',
            peleVidro: 'https://i.imgur.com/wbcNs8Wl.jpeg',
        },
        types: {
            /** Ícones/Ilustrações dos tipos de abertura (Correr, Maxim-ar, etc) */
            /** Nota: Atualmente usando um placeholder genérico para todos */
            placeholder: 'https://i.imgur.com/NWPWZvQl.png',
        },
        cta: {
            /** Background da seção "Pronto para Elevar seu Projeto?" */
            background: 'https://i.imgur.com/0rQ5ev1.jpeg',
        }
    },

    // ========================================================================
    // 4. PÁGINA DE SOBRE (QUEM SOMOS)
    // ========================================================================
    about: {
        hero: 'https://i.imgur.com/8aAdTKyl.jpeg', // Banner principal com a equipe
        showroom: 'https://i.imgur.com/gGNqV8dl.jpeg', // Foto do showroom/escritório
        cta: {
            background: 'https://i.imgur.com/1qlbJxt.jpeg',
        }
    },

    // ========================================================================
    // 5. PORTFÓLIO (PROJETOS)
    // ========================================================================
    portfolio: {
        project1: {
            main: 'https://i.imgur.com/uDRif7Ql.jpeg',
            gallery: ['https://i.imgur.com/uDRif7Ql.jpeg', 'https://i.imgur.com/N7fDb4al.jpeg', 'https://i.imgur.com/YgT81p4l.jpeg']
        },
        project2: {
            main: 'https://i.imgur.com/Xp9pynVl.jpeg',
            gallery: ['https://i.imgur.com/Xp9pynVl.jpeg', 'https://i.imgur.com/kSj9d2vl.jpeg']
        },
        project3: {
            main: 'https://i.imgur.com/JUvwwe3l.jpg',
            gallery: ['https://i.imgur.com/JUvwwe3.mp4'] // Vídeo
        },
        project4: {
            main: 'https://i.imgur.com/f048dG5l.jpeg',
            gallery: ['https://i.imgur.com/f048dG5l.jpeg', 'https://i.imgur.com/Bf4mRmsl.jpeg', 'https://i.imgur.com/HSc3VmK.mp4']
        },
        project5: {
            main: 'https://i.imgur.com/gGNqV8dl.jpeg',
            gallery: ['https://i.imgur.com/gGNqV8dl.jpeg', 'https://i.imgur.com/3Zf9v7Al.jpeg']
        },
        project6: {
            main: 'https://i.imgur.com/O1x9h66l.jpeg',
            gallery: ['https://i.imgur.com/O1x9h66l.jpeg', 'https://i.imgur.com/pZqTVmGl.jpeg']
        },
        project7: {
            main: 'https://i.imgur.com/N7fDb4al.jpeg',
            gallery: ['https://i.imgur.com/N7fDb4al.jpeg', 'https://i.imgur.com/YgT81p4l.jpeg']
        },
        project8: {
            main: 'https://i.imgur.com/3Zf9v7Al.jpeg',
            gallery: ['https://i.imgur.com/3Zf9v7Al.jpeg', 'https://i.imgur.com/gGNqV8dl.jpeg', 'https://i.imgur.com/uDRif7Ql.jpeg']
        },
        project9: {
            main: 'https://i.imgur.com/ew22VEFl.jpg',
            gallery: ['https://i.imgur.com/ew22VEF.mp4', 'https://i.imgur.com/AQsR2Jml.jpeg']
        },
        cta: {
            background: 'https://i.imgur.com/1qlbJxt.jpeg' // Reuso da imagem de Sobre
        }
    },

    // ========================================================================
    // 6. EQUIPE
    // ========================================================================
    team: {
        hercules: 'https://i.imgur.com/q8qrp0zm.png',
        cleide: 'https://i.imgur.com/vpMKntAm.png',
        jose: 'https://i.imgur.com/j42e8Jt.jpeg',
        leandro: 'https://i.imgur.com/HxKNKwht.jpeg',
        philippe: 'https://i.imgur.com/TNMBi27t.jpeg',
        guilherme: 'https://i.imgur.com/uGFGBTY.jpeg',
        marcelo: 'https://i.imgur.com/A7DlGJB.jpeg',
        func6: 'https://i.imgur.com/T6EiYQ9.jpeg',
        func7: 'https://i.imgur.com/vHq4Q8Ct.jpeg',
        func8: 'https://i.imgur.com/Oy9Xq2jt.jpeg',
        cta: {
            background: 'https://i.imgur.com/0rQ5ev1.jpeg' // Reuso da imagem de Serviços
        }
    },

    // ========================================================================
    // 7. PARCEIROS E CERTIFICAÇÕES (RODAPÉ)
    // ========================================================================
    partners: {
        hydro: 'https://i.imgur.com/HlkWrwd.png',
        abnt: 'https://i.imgur.com/0Cjohne.png',
        iso9001: 'https://i.imgur.com/04tUYho.png',
        nr35: 'https://i.imgur.com/lQK6f6h.png',
        nr12: 'https://i.imgur.com/L54QH5M.png',
        nr18: 'https://i.imgur.com/fAZauop.png',
        nr06: 'https://i.imgur.com/fWpdU8d.png',
    }
};
