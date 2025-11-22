import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useScrollReveal, KineticText } from './ui/Animations';
import { useFocusTrap } from './ui/hooks';
import ImageWithLoader from './ui/ImageWithLoader';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';

// ==================== TYPES ====================
type Category = 'Todos' | 'Residencial' | 'Comercial' | 'Industrial';

interface ProjectDetails {
    Local: string;
    Linha: string;
    Acabamento: string;
    [key: string]: string;
}

interface Project {
    id: number;
    title: string;
    category: Category;
    image: string;
    imageWidth: number;
    imageHeight: number;
    description: string;
    details: ProjectDetails;
    gallery: string[];
    size?: 'large-rect' | 'tall-rect';
}

interface FilterButtonProps {
    category: Category;
    isActive: boolean;
    onClick: () => void;
}

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    sizeClass: string;
    fetchPriority?: 'high' | 'low' | 'auto';
}

interface ModalProps {
    project: Project;
    currentImageIndex: number;
    onClose: () => void;
    onNextImage: (e: React.MouseEvent) => void;
    onPrevImage: (e: React.MouseEvent) => void;
    onSelectImage: (index: number) => void;
}

// ==================== CONSTANTS ====================
const CATEGORIES: Category[] = [
    TEXTS.portfolio.filters.all as Category, 
    TEXTS.portfolio.filters.residential as Category, 
    TEXTS.portfolio.filters.commercial as Category, 
    TEXTS.portfolio.filters.industrial as Category
];

const SIZE_CLASS_MAP: Record<string, string> = {
    'large-rect': 'md:col-span-2',
    'tall-rect': 'row-span-2',
};

const PORTFOLIO_DATA: Project[] = [
    {
        id: 1,
        title: 'Residência Lago Sul',
        category: 'Residencial',
        image: IMAGES.portfolio.project1.main,
        imageWidth: 400,
        imageHeight: 560,
        description: 'Projeto completo de esquadrias para residência de alto padrão, integrando ambientes internos e externos com design sofisticado e funcionalidade superior.',
        details: {
            Local: 'Lago Sul, DF',
            Linha: 'Alumínio Inova',
            Acabamento: 'Preto Fosco'
        },
        gallery: IMAGES.portfolio.project1.gallery,
        size: 'tall-rect',
    },
    {
        id: 2,
        title: 'Edifício Corporativo',
        category: 'Comercial',
        image: IMAGES.portfolio.project2.main,
        imageWidth: 400,
        imageHeight: 640,
        description: 'Fachada em pele de vidro e esquadrias para escritórios, focando em isolamento acústico e eficiência energética para máximo conforto.',
        details: {
            Local: 'Setor Noroeste, DF',
            Linha: 'Sistema Atlanta',
            Acabamento: 'Prata Anodizado'
        },
        gallery: IMAGES.portfolio.project2.gallery,
        size: 'large-rect',
    },
    {
        id: 3,
        title: 'Galpão Industrial SIA',
        category: 'Industrial',
        image: IMAGES.portfolio.project3.main,
        imageWidth: 400,
        imageHeight: 480,
        description: 'Janelas e portões de alumínio de alta resistência para complexo industrial, garantindo durabilidade e segurança em ambientes exigentes.',
        details: {
            Local: 'SIA, DF',
            Linha: 'Inova Industrial',
            Acabamento: 'Branco Epóxi'
        },
        gallery: IMAGES.portfolio.project3.gallery
    },
    {
        id: 4,
        title: 'Casa Jardim Botânico',
        category: 'Residencial',
        image: IMAGES.portfolio.project4.main,
        imageWidth: 400,
        imageHeight: 520,
        description: 'Grandes vãos de vidro com portas de correr que conectam a casa à natureza, proporcionando amplitude e integração com o exterior.',
        details: {
            Local: 'Jardim Botânico, DF',
            Linha: 'Alumínio Inova',
            Acabamento: 'Efeito Madeira'
        },
        gallery: IMAGES.portfolio.project4.gallery,
    },
    {
        id: 5,
        title: 'Loja Conceito Asa Sul',
        category: 'Comercial',
        image: IMAGES.portfolio.project5.main,
        imageWidth: 400,
        imageHeight: 600,
        description: 'Vitrine imponente com porta pivotante de alumínio, refletindo a sofisticação da marca e criando impacto visual.',
        details: {
            Local: 'Asa Sul, DF',
            Linha: 'Personalizada',
            Acabamento: 'Dourado Escovado'
        },
        gallery: IMAGES.portfolio.project5.gallery
    },
    {
        id: 6,
        title: 'Cobertura Águas Claras',
        category: 'Residencial',
        image: IMAGES.portfolio.project6.main,
        imageWidth: 400,
        imageHeight: 680,
        description: 'Fechamento de sacada com sistema retrátil e guarda-corpos em alumínio e vidro, unindo segurança e estética contemporânea.',
        details: {
            Local: 'Águas Claras, DF',
            Linha: 'Sistema Stanley',
            Acabamento: 'Preto Fosco'
        },
        gallery: IMAGES.portfolio.project6.gallery,
        size: 'tall-rect',
    },
    {
        id: 7,
        title: 'Clínica Médica Sudoeste',
        category: 'Comercial',
        image: IMAGES.portfolio.project7.main,
        imageWidth: 400,
        imageHeight: 500,
        description: 'Esquadrias com tratamento acústico especial para garantir a privacidade e conforto dos pacientes em ambiente clínico.',
        details: {
            Local: 'Sudoeste, DF',
            Linha: 'Inova Acústica',
            Acabamento: 'Branco Epóxi'
        },
        gallery: IMAGES.portfolio.project7.gallery,
        size: 'large-rect',
    },
    {
        id: 8,
        title: 'Residência Park Way',
        category: 'Residencial',
        image: IMAGES.portfolio.project8.main,
        imageWidth: 400,
        imageHeight: 620,
        description: 'Portas pivotantes de grande formato e janelas maxim-ar que valorizam a arquitetura moderna com linhas arrojadas.',
        details: {
            Local: 'Park Way, DF',
            Linha: 'Alumínio Inova IV',
            Acabamento: 'Cortén'
        },
        gallery: IMAGES.portfolio.project8.gallery
    },
    {
        id: 9,
        title: 'Fábrica no Polo JK',
        category: 'Industrial',
        image: IMAGES.portfolio.project9.main,
        imageWidth: 400,
        imageHeight: 550,
        description: 'Brises de alumínio para controle solar na fachada e portas de enrolar automatizadas para docas de carregamento.',
        details: {
            Local: 'Polo JK, DF',
            Linha: 'Inova / Industrial',
            Acabamento: 'Natural Fosco'
        },
        gallery: IMAGES.portfolio.project9.gallery
    },
];

// ==================== UTILITY FUNCTIONS ====================
const isVideoFile = (url: string): boolean => {
    return url.toLowerCase().endsWith('.mp4');
};

const getMediaAltText = (projectTitle: string, index: number): string => {
    return `${projectTitle} - Imagem ${index + 1}`;
};

// ==================== COMPONENTS ====================

// Filter Button Component
const FilterButton: React.FC<FilterButtonProps> = ({ category, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-full font-poppins font-semibold text-sm md:text-base transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            isActive
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-body hover:bg-slate-200 shadow-sm'
        }`}
        aria-pressed={isActive}
    >
        {category}
    </button>
);

// Project Card Component
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, sizeClass, fetchPriority }) => (
    <div
        className={`cursor-pointer group animate-fadeInUp ${sizeClass}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }}
        aria-label={`Ver detalhes do projeto ${project.title}`}
    >
        <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full w-full">
            <ImageWithLoader
                src={project.image}
                alt={project.title}
                width={project.imageWidth}
                height={project.imageHeight}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                fetchPriority={fetchPriority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <p className="text-white/80 font-semibold text-sm">{project.category}</p>
                    <h3 className="text-white font-armstrong text-2xl uppercase leading-tight">
                        {project.title}
                    </h3>
                </div>
            </div>
        </div>
    </div>
);

// Modal Component
const ProjectModal: React.FC<ModalProps> = ({
    project,
    currentImageIndex,
    onClose,
    onNextImage,
    onPrevImage,
    onSelectImage,
}) => {
    const modalRef = useFocusTrap(true);
    const currentMediaUrl = project.gallery[currentImageIndex];
    const isVideo = isVideoFile(currentMediaUrl);
    const altText = getMediaAltText(project.title, currentImageIndex);
    const hasMultipleImages = project.gallery.length > 1;

    return (
        // Z-Index 2000 to stay above Header
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[2000] flex flex-col md:flex-row items-center justify-center p-0 md:p-4 animate-fadeInUp overflow-hidden"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
        >
            <div
                ref={modalRef}
                className="relative bg-primary md:rounded-[2.5rem] w-full max-w-5xl h-full md:h-auto md:max-h-[80vh] shadow-2xl flex flex-col md:flex-row overflow-hidden border-0 md:border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (Desktop Only - Mobile uses bottom bar) */}
                <button
                    onClick={onClose}
                    className="hidden md:block absolute top-4 right-4 md:top-6 md:right-6 text-white bg-black/20 hover:bg-white/20 rounded-full p-2 transition-colors z-30 backdrop-blur-sm"
                    aria-label="Fechar modal"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                {/* Media Gallery Section */}
                <div className="w-full md:w-3/5 h-[55vh] md:h-auto relative bg-black flex-shrink-0 flex items-center justify-center p-0 md:p-4 group">
                    {isVideo ? (
                        <video
                            key={currentMediaUrl}
                            src={currentMediaUrl}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label={altText}
                        />
                    ) : (
                        <ImageWithLoader
                            src={currentMediaUrl}
                            alt={altText}
                            width="1024"
                            height="768"
                            className="w-full h-full object-contain"
                        />
                    )}

                    {/* Desktop Navigation Controls */}
                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={onPrevImage}
                                aria-label="Imagem anterior"
                                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-3 text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-110"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={onNextImage}
                                aria-label="Próxima imagem"
                                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-3 text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-110"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>

                            {/* Pagination Dots */}
                            <div
                                className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20"
                                role="tablist"
                                aria-label="Navegação da galeria"
                            >
                                {project.gallery.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectImage(index);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            currentImageIndex === index
                                                ? 'bg-white w-6'
                                                : 'bg-white/40 hover:bg-white/70'
                                        }`}
                                        aria-label={`Ir para imagem ${index + 1}`}
                                        aria-selected={currentImageIndex === index}
                                        role="tab"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Project Details Section */}
                <div className="w-full md:w-2/5 h-[45vh] md:h-full bg-primary flex flex-col relative">
                     {/* Details Content - Scrollable */}
                    <div className="flex-grow overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
                        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
                            {project.category}
                        </div>
                        
                        <h2
                            id="project-modal-title"
                            className="font-armstrong text-2xl md:text-4xl uppercase text-white mb-4 md:mb-6 leading-tight"
                        >
                            {project.title}
                        </h2>
                        
                        <p className="text-white/80 mb-6 md:mb-8 leading-relaxed text-sm md:text-lg">
                            {project.description}
                        </p>

                        <div className="bg-white/5 rounded-2xl p-5 md:p-6 border border-white/5 mb-6">
                            <h4 className="font-armstrong text-sm uppercase text-white/50 mb-4 tracking-widest">
                                {TEXTS.portfolio.modal.techSpecs}
                            </h4>
                            <ul className="space-y-3 md:space-y-4">
                                {Object.entries(project.details).map(([key, value]) => (
                                    <li key={key} className="flex flex-col border-b border-white/5 pb-2 md:pb-3 last:border-0 last:pb-0">
                                        <span className="text-xs text-white/60 uppercase font-semibold mb-1">{key}</span>
                                        <span className="text-white font-medium text-base md:text-lg">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Desktop CTA Button */}
                        <div className="hidden md:block mt-4">
                             <Link
                                to="/contato"
                                className="inline-flex w-full items-center justify-center bg-accent text-primary font-bold text-base uppercase px-8 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 shimmer-effect hover:shadow-lg hover:shadow-accent/20"
                            >
                                {TEXTS.global.buttons.requestBudget}
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Bottom Control Bar (Thumb-Friendly) */}
                    <div className="md:hidden fixed bottom-0 left-0 w-full bg-primary/95 backdrop-blur-lg border-t border-white/10 p-4 flex items-center justify-between gap-3 z-50 pb-safe safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                         <button 
                            onClick={onPrevImage}
                            disabled={!hasMultipleImages}
                            className="flex-1 bg-white/10 active:bg-white/20 rounded-xl p-4 flex justify-center text-white transition-colors disabled:opacity-30"
                            aria-label="Anterior"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                         
                         <button 
                            onClick={onClose}
                            className="flex-[2] bg-accent active:bg-accent-dark text-primary font-bold uppercase text-sm p-4 rounded-xl flex justify-center items-center shadow-lg"
                        >
                            {TEXTS.global.buttons.close}
                        </button>

                        <button 
                            onClick={onNextImage}
                            disabled={!hasMultipleImages}
                            className="flex-1 bg-white/10 active:bg-white/20 rounded-xl p-4 flex justify-center text-white transition-colors disabled:opacity-30"
                            aria-label="Próxima"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
const PortfolioPage: React.FC = () => {
    // Refs and Hooks
    const addToRefs = useScrollReveal();

    // State Management
    const [activeFilter, setActiveFilter] = useState<Category>(TEXTS.portfolio.filters.all as Category);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Memoized Values
    const filteredProjects = useMemo(() => {
        if (activeFilter === TEXTS.portfolio.filters.all) return PORTFOLIO_DATA;
        return PORTFOLIO_DATA.filter((p) => p.category === activeFilter);
    }, [activeFilter]);

    // Event Handlers
    const openModal = useCallback((project: Project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeModal = useCallback(() => {
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
    }, []);

    const nextImage = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (selectedProject) {
                setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % selectedProject.gallery.length
                );
            }
        },
        [selectedProject]
    );

    const prevImage = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (selectedProject) {
                setCurrentImageIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + selectedProject.gallery.length) %
                        selectedProject.gallery.length
                );
            }
        },
        [selectedProject]
    );

    const selectImage = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);

    // Effects
    useEffect(() => {
        document.title = 'Portfólio | Projetos com Linha Inova | HCE Esquadrias';

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute(
            'content',
            'Veja nosso portfólio de projetos residenciais, comerciais e industriais. Obras com esquadrias de alumínio de alto padrão da Linha Inova, pele de vidro e acabamentos sofisticados em Brasília-DF.'
        );
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProject) {
                closeModal();
            }
        };

        const handleArrowKeys = (e: KeyboardEvent) => {
            if (!selectedProject) return;

            if (e.key === 'ArrowRight') {
                setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % selectedProject.gallery.length
                );
            } else if (e.key === 'ArrowLeft') {
                setCurrentImageIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + selectedProject.gallery.length) %
                        selectedProject.gallery.length
                );
            }
        };

        window.addEventListener('keydown', handleEscape);
        window.addEventListener('keydown', handleArrowKeys);

        return () => {
            window.removeEventListener('keydown', handleEscape);
            window.removeEventListener('keydown', handleArrowKeys);
        };
    }, [selectedProject, closeModal]);

    // Render
    return (
        <div className="bg-white">
            {/* Header Section */}
            <header className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text={TEXTS.portfolio.header.title} />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        {TEXTS.portfolio.header.description}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Filter Buttons */}
                <div
                    ref={addToRefs}
                    className="flex justify-center flex-wrap gap-3 md:gap-4 mb-16 scroll-reveal"
                    style={{ transitionDelay: '200ms' }}
                >
                    {CATEGORIES.map((category) => (
                        <FilterButton
                            key={category}
                            category={category}
                            isActive={activeFilter === category}
                            onClick={() => setActiveFilter(category)}
                        />
                    ))}
                </div>

                {/* Projects Grid */}
                <div
                    key={activeFilter}
                    className="grid grid-cols-2 md:grid-cols-4 auto-rows-[280px] gap-4 md:gap-8"
                >
                    {filteredProjects.map((project, index) => {
                        const sizeClass =
                            SIZE_CLASS_MAP[project.size as keyof typeof SIZE_CLASS_MAP] || '';
                        return (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => openModal(project)}
                                sizeClass={sizeClass}
                                fetchPriority={index < 4 ? 'high' : 'auto'}
                            />
                        );
                    })}
                </div>
            </main>

            {/* CTA Section com ImmersiveSection */}
            <ImmersiveSection backgroundImage={IMAGES.portfolio.cta.background}>
                <div className="text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                            <KineticText text={TEXTS.portfolio.cta.title} />
                        </h2>
                        <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            {TEXTS.portfolio.cta.description}
                        </p>
                        <div>
                            <Link
                                to="/contato"
                                className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect"
                            >
                                {TEXTS.global.buttons.requestBudget}
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </ImmersiveSection>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    currentImageIndex={currentImageIndex}
                    onClose={closeModal}
                    onNextImage={nextImage}
                    onPrevImage={prevImage}
                    onSelectImage={selectImage}
                />
            )}
        </div>
    );
};

export default PortfolioPage;