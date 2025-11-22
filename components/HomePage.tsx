
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, SearchPlusIcon } from './icons';
import { useScrollReveal, KineticText } from './ui/Animations';
import { useFocusTrap } from './ui/hooks';
import Counter from './ui/Counter';
import ImageWithLoader from './ui/ImageWithLoader';
import AnimatedGridBackground from './ui/AnimatedGridBackground';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';
import { CONFIG } from './utils/config';

// Componente de animação de introdução isolado para o herói
const HeroIntroAnimation: React.FC = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        try {
            const hasAnimated = sessionStorage.getItem('heroAnimated');
            if (hasAnimated) {
                setIsFinished(true);
            } else {
                setShouldAnimate(true);
            }
        } catch (e) {
            // Se o sessionStorage não estiver disponível, anime sempre para robustez.
            setShouldAnimate(true);
        }
    }, []);

    useEffect(() => {
        if (!shouldAnimate) return;

        document.body.style.overflow = 'hidden'; // Evita rolagem durante a animação

        // Inicia a animação logo após a montagem do componente
        const startTimer = setTimeout(() => setIsAnimating(true), 100);
        
        // Marca como concluído para remover do DOM após a animação
        // A animação dura 1.2s, espere 1.5s por segurança
        const finishTimer = setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = ''; // Restaura a rolagem
            try {
                sessionStorage.setItem('heroAnimated', 'true');
            } catch (e) {
                // Falha silenciosamente se o armazenamento não estiver disponível.
            }
        }, 1500);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(finishTimer);
            document.body.style.overflow = ''; // Garante que a rolagem seja restaurada na desmontagem
        };
    }, [shouldAnimate]);

    if (isFinished) {
        return null;
    }
    
    if (!shouldAnimate) {
        return null;
    }

    return (
        <div 
            className={`fixed top-0 left-0 w-full h-screen z-[60] overflow-hidden`}
            aria-hidden="true"
        >
            <div 
                className={`
                    absolute top-0 left-0 w-full h-full bg-primary transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)]
                    ${isAnimating ? 'translate-x-full' : 'translate-x-0'}
                `}
                style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
                }}
            />
        </div>
    );
};

const useHeroParallax = (speed: number) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        // Check config first
        if (!element || !CONFIG.ui.enableParallax) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        let rafId: number;
        let isActive = false;

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
            });
        };
        
        const setup = () => {
            if (window.innerWidth >= 1024 && !isActive) {
                window.addEventListener('scroll', onScroll, { passive: true });
                element.style.willChange = 'transform';
                onScroll(); // Set initial position
                isActive = true;
            } else if (window.innerWidth < 1024 && isActive) {
                window.removeEventListener('scroll', onScroll);
                element.style.transform = ''; // Reset transform
                element.style.willChange = 'auto';
                cancelAnimationFrame(rafId);
                isActive = false;
            }
        };
        
        window.addEventListener('resize', setup);
        setup(); // Initial setup

        return () => {
            window.removeEventListener('resize', setup);
            if (isActive) {
                window.removeEventListener('scroll', onScroll);
            }
            cancelAnimationFrame(rafId);
        };
    }, [speed]);

    return ref;
};

// Uses the centralized IMAGES object for the carousel
const mediaData = IMAGES.home.carousel.map(item => ({
    type: item.type,
    src: item.src,
    thumbnail: item.thumb,
    alt: item.alt
}));

const createGroups = (items, size) => {
    const groups = [];
    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.length < size) {
        const placeholders = Array(size - lastGroup.length).fill(null);
        groups[groups.length - 1] = [...lastGroup, ...placeholders];
    }
    return groups;
};

// Using centralized texts for the services preview
const servicesData = [
    {
        title: TEXTS.services.items.esquadrias.title,
        desc: TEXTS.services.items.esquadrias.description,
        image: IMAGES.home.servicesPreview.esquadrias,
        link: '/servicos#esquadrias-aluminio'
    },
    {
        title: TEXTS.services.items.brises.title,
        desc: TEXTS.services.items.brises.description,
        image: IMAGES.home.servicesPreview.brises,
        link: '/servicos#ripados-brises'
    },
    {
        title: TEXTS.services.items.guardaCorpo.title,
        desc: TEXTS.services.items.guardaCorpo.description,
        image: IMAGES.home.servicesPreview.guardaCorpo,
        link: '/servicos#guarda-corpos'
    },
    {
        title: TEXTS.services.items.peleVidro.title,
        desc: TEXTS.services.items.peleVidro.description,
        image: IMAGES.home.servicesPreview.peleVidro,
        link: '/servicos#pele-de-vidro'
    }
];

const HomePage: React.FC = () => {
    useEffect(() => {
        document.title = 'HCE Esquadrias de Alumínio em Brasília-DF | Projetos de Alto Padrão';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Especialistas em esquadrias de alumínio em Brasília. Portas, janelas, pele de vidro e projetos personalizados com precisão e design para obras residenciais e comerciais.');
    }, []);

    const addToRefs = useScrollReveal();
    
    // Parallax refs for hero images
    const parallaxRef1 = useHeroParallax(-0.1); // Back, moves up slowly
    const parallaxRef2 = useHeroParallax(0.05); // Middle, moves down slowly
    const parallaxRef3 = useHeroParallax(0.15); // Front, moves down faster

    // Logic for Team Carousel, moved from AboutPage
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [noTransition, setNoTransition] = useState(false);

    const autoPlayRef = useRef(null);
    const modalRef = useFocusTrap(isModalOpen);

    const mediaGroups = useMemo(() => createGroups(mediaData, 4), []);
    const slidesWithClones = useMemo(() => {
        if (mediaGroups.length === 0) return [];
        return [mediaGroups[mediaGroups.length - 1], ...mediaGroups, mediaGroups[0]];
    }, [mediaGroups]);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlaying(false);
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    }, []);
    
    const startAutoPlay = useCallback(() => {
        setIsAutoPlaying(true);
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setCurrentSlide(prev => prev + 1);
        }, 5000);
    }, []);

    useEffect(() => {
        if (CONFIG.pages.home.showTeamCarousel) {
            if (isAutoPlaying && !isModalOpen && mediaGroups.length > 1) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        }
        return () => stopAutoPlay();
    }, [isAutoPlaying, isModalOpen, mediaGroups.length, startAutoPlay, stopAutoPlay]);
    
    const handleTransitionEnd = () => {
        if (currentSlide <= 0) {
            setNoTransition(true);
            setCurrentSlide(mediaGroups.length);
        }
        if (currentSlide >= mediaGroups.length + 1) {
            setNoTransition(true);
            setCurrentSlide(1);
        }
    };
    
    useEffect(() => {
        if (noTransition) {
            const timer = setTimeout(() => setNoTransition(false), 50);
            return () => clearTimeout(timer);
        }
    }, [noTransition]);

    const openModal = useCallback((index) => {
        setSelectedMediaIndex(index);
        setIsModalOpen(true);
        stopAutoPlay();
        document.body.style.overflow = 'hidden';
    }, [stopAutoPlay]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        startAutoPlay();
        document.body.style.overflow = 'auto';
    }, [startAutoPlay]);

    const nextSlide = useCallback(() => {
        stopAutoPlay();
        setCurrentSlide(prev => prev + 1);
    }, [stopAutoPlay]);

    const prevSlide = useCallback(() => {
        stopAutoPlay();
        setCurrentSlide(prev => prev - 1);
    }, [stopAutoPlay]);

    const goToSlide = useCallback((index) => {
        stopAutoPlay();
        setCurrentSlide(index + 1);
    }, [stopAutoPlay]);

    const showNextMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev + 1) % mediaData.length);
    }, []);

    const showPrevMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev - 1 + mediaData.length) % mediaData.length);
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isModalOpen) {
                if (e.key === 'ArrowRight') showNextMedia(e);
                if (e.key === 'ArrowLeft') showPrevMedia(e);
                if (e.key === 'Escape') closeModal();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, showNextMedia, showPrevMedia, closeModal]);

    const currentMedia = mediaData[selectedMediaIndex];
    const activeDotIndex = currentSlide === 0 ? mediaGroups.length - 1 : currentSlide === mediaGroups.length + 1 ? 0 : currentSlide - 1;

    return (
        <div className="bg-soft-gray overflow-x-hidden">
            <HeroIntroAnimation />
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.3s ease-out; }
            `}</style>
            {/* Hero Section - Full Screen com Split Layout */}
            <section className="min-h-screen relative overflow-hidden">
                {/* Background com Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-heading"></div>
                
                {/* Animated Grid Overlay */}
                {CONFIG.ui.enableParticles && <AnimatedGridBackground />}

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen flex items-center py-24 lg:py-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
                        <div className="text-left space-y-8">
                            <div ref={addToRefs} className="scroll-reveal">
                                <span className="text-accent font-bold text-sm uppercase tracking-widest">{TEXTS.home.hero.preTitle}</span>
                            </div>
                            <h1 ref={addToRefs} className="font-armstrong text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white tracking-tighter scroll-reveal" style={{ transitionDelay: '200ms' }}>
                               <KineticText text={TEXTS.home.hero.title} />
                            </h1>
                            <p ref={addToRefs} className="text-lg sm:text-xl max-w-xl text-white/90 leading-relaxed scroll-reveal" style={{ transitionDelay: '400ms' }}>
                                {TEXTS.home.hero.description}
                            </p>
                            <div ref={addToRefs} className="flex flex-col sm:flex-row gap-6 pt-4 scroll-reveal" style={{ transitionDelay: '600ms' }}>
                                <Link to="/contato" className="inline-block bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect text-center">
                                    {TEXTS.global.buttons.startProject}
                                </Link>
                                <Link to="/portfolio" className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:bg-white/20 border-2 border-white/30 text-center">
                                    {TEXTS.global.buttons.viewWork}
                                </Link>
                            </div>
                        </div>
                        
                        {/* Desktop Image Grid */}
                        <div ref={addToRefs} className="relative h-[600px] scroll-reveal hidden lg:block" style={{ transitionDelay: '300ms' }}>
                            <div ref={parallaxRef1} className="absolute top-0 right-0 w-[55%] h-[45%]">
                                <div className="h-full w-full overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                    <ImageWithLoader src={IMAGES.home.hero.parallax1} alt="Projeto residencial com esquadrias de alumínio" className="w-full h-full object-cover" fetchPriority="high"/>
                                </div>
                            </div>
                            <div ref={parallaxRef2} className="absolute bottom-0 left-0 w-[55%] h-[45%]">
                                <div className="h-full w-full overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                    <ImageWithLoader src={IMAGES.home.hero.parallax2} alt="Interior de casa moderna com grandes janelas" className="w-full h-full object-cover" fetchPriority="high"/>
                                </div>
                            </div>
                            <div ref={parallaxRef3} className="absolute top-1/2 left-1/2 w-[45%] h-[55%] z-10">
                                <div className="h-full w-full transform -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500 ring-8 ring-white/10">
                                    <ImageWithLoader src={IMAGES.home.hero.parallax3} alt="Fachada de prédio comercial com pele de vidro" className="w-full h-full object-cover" fetchPriority="high"/>
                                </div>
                            </div>
                        </div>
                        {/* Mobile Image */}
                        <div ref={addToRefs} className="block lg:hidden scroll-reveal mt-12" style={{ transitionDelay: '300ms' }}>
                            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto h-[450px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/10">
                                <ImageWithLoader src={IMAGES.home.hero.parallax1} alt="Projeto de esquadrias de alumínio" className="w-full h-full object-cover" fetchPriority="high"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
                    <span className="text-xs uppercase tracking-widest">Descer</span>
                    <div className="w-[1px] h-12 bg-white/30"></div>
                </div>
            </section>

            {/* Stats Section */}
            {CONFIG.pages.home.showStats && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { end: 1, suffix: 'º', label: TEXTS.home.stats.delivered },
                                { end: 100, suffix: '%', label: TEXTS.home.stats.precision },
                                { end: 100, suffix: '%', label: TEXTS.home.stats.satisfaction },
                                { end: 10, suffix: '+', label: TEXTS.home.stats.professionals }
                            ].map((stat, index) => (
                                <div key={index} ref={addToRefs} className="text-center scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                    <Counter
                                        end={stat.end}
                                        suffix={stat.suffix}
                                        className="font-armstrong text-4xl sm:text-5xl md:text-6xl text-primary mb-2"
                                        duration={2000}
                                    />
                                    <div className="text-body text-sm uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            
            {/* Services Section - Cards com Hover Effect */}
            <section className="py-24 md:py-32 bg-soft-gray">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="max-w-3xl mb-16 md:mb-20 scroll-reveal">
                         <span className="text-primary font-bold text-sm uppercase tracking-widest">{TEXTS.home.servicesIntro.label}</span>
                         <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase text-heading tracking-tight mt-4">
                            <KineticText text={TEXTS.home.servicesIntro.title} />
                         </h2>
                         <p className="mt-6 text-lg sm:text-xl text-body">{TEXTS.home.servicesIntro.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {servicesData.map((service, index) => (
                             <div key={index} ref={addToRefs} className="group scroll-reveal" style={{transitionDelay: `${index * 150}ms`}}>
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden">
                                        <ImageWithLoader
                                            src={service.image} 
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="font-armstrong text-2xl uppercase text-heading mb-4">{service.title}</h3>
                                        <p className="text-body leading-relaxed mb-6 flex-grow">{service.desc}</p>
                                        <Link to={service.link} className="inline-flex items-center text-primary font-bold group-hover:text-accent transition-colors duration-300 mt-auto self-start">
                                            {TEXTS.global.buttons.learnMore}
                                            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                                        </Link>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Full Width */}
            <section className="py-24 md:py-32 bg-heading text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-20">
                        <div ref={addToRefs} className="scroll-reveal">
                             <span className="text-accent font-bold text-sm uppercase tracking-widest">{TEXTS.home.portfolioIntro.label}</span>
                             <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight mt-4 mb-6">
                                <KineticText text={TEXTS.home.portfolioIntro.title} />
                             </h2>
                             <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                                {TEXTS.home.portfolioIntro.description}
                             </p>
                        </div>
                        <div ref={addToRefs} className="scroll-reveal" style={{ transitionDelay: '200ms' }}>
                            <Link to="/portfolio" className="inline-block bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect">
                                {TEXTS.global.buttons.viewWork}
                            </Link>
                        </div>
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                           {img: IMAGES.portfolio.project5.main, alt: 'Projeto residencial com fachada moderna'},
                           {img: IMAGES.portfolio.project7.main, alt: 'Sala de estar com grandes janelas de alumínio'},
                           {img: IMAGES.portfolio.project4.gallery[1], alt: 'Portas de correr de vidro conectando ambiente interno e externo'},
                           {img: IMAGES.home.hero.parallax1, alt: 'Casa de luxo com esquadrias pretas'},
                           {img: IMAGES.home.hero.parallax2, alt: 'Detalhe de acabamento de esquadria de alumínio'},
                           {img: IMAGES.home.hero.parallax3, alt: 'Edifício comercial com pele de vidro espelhada'}
                        ].map((item, index) => (
                            <div 
                                key={index} 
                                ref={addToRefs} 
                                className="relative h-64 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer scroll-reveal"
                                style={{transitionDelay: `${index * 100}ms`}}
                            >
                                <ImageWithLoader
                                    src={item.img} 
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h4 className="font-armstrong text-2xl uppercase text-white mb-2">Projeto Residencial</h4>
                                        <p className="text-white/80 text-sm">Esquadrias Premium</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section (Replaces Testimonials) */}
            {CONFIG.pages.home.showTeamCarousel && (
                <section className="bg-white py-24 md:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div ref={addToRefs} className="max-w-3xl mx-auto text-center mb-16 md:mb-20 scroll-reveal">
                            <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-wider">
                                <KineticText text={TEXTS.home.teamIntro.title} />
                            </h2>
                            <p className="mt-6 text-lg sm:text-xl text-body max-w-2xl mx-auto">
                                {TEXTS.home.teamIntro.description}
                            </p>
                        </div>

                        <div 
                            ref={addToRefs}
                            className="relative max-w-7xl mx-auto scroll-reveal"
                            style={{transitionDelay: '200ms'}}
                            onMouseEnter={stopAutoPlay}
                            onMouseLeave={startAutoPlay}
                        >
                             <div className="overflow-hidden">
                                <div 
                                    className="flex"
                                    style={{
                                        transform: `translateX(-${currentSlide * 100}%)`,
                                        transition: noTransition ? 'none' : 'transform 700ms ease-in-out',
                                    }}
                                    onTransitionEnd={handleTransitionEnd}
                                >
                                    {slidesWithClones.map((group, groupIndex) => (
                                        <div 
                                            key={groupIndex}
                                            className="w-full flex-shrink-0 px-2"
                                        >
                                            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[450px] md:h-[500px]">
                                                {group.map((item, itemIndex) => {
                                                    if (!item) {
                                                        return <div key={itemIndex} className="bg-slate-100 rounded-2xl" />;
                                                    }
                                                    const globalIndex = mediaData.indexOf(item);
                                                    let gridClasses = '';
                                                    if(itemIndex === 0) gridClasses = 'col-span-2 row-span-2';
                                                    else if (itemIndex === 1) gridClasses = 'col-span-2 row-span-1';
                                                    else gridClasses = 'col-span-1 row-span-1';

                                                    return (
                                                        <div 
                                                            key={item.src + itemIndex}
                                                            className={`${gridClasses} group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                                                            onClick={() => openModal(globalIndex)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(globalIndex); }}
                                                            aria-label={`Ver ${item.type === 'video' ? 'vídeo' : 'imagem'}: ${item.alt}`}
                                                        >
                                                            <ImageWithLoader
                                                                src={item.thumbnail} 
                                                                alt={item.alt}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                                    <SearchPlusIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {mediaGroups.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 lg:-translate-x-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                                        aria-label="Slide anterior"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6 lg:w-8 lg:h-8 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 lg:right-0 top-1/2 -translate-y-1/2 lg:translate-x-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                                        aria-label="Próximo slide"
                                    >
                                        <ChevronRightIcon className="w-6 h-6 lg:w-8 lg:h-8 text-gray-800" />
                                    </button>
                                    <div className="flex justify-center gap-3 mt-10">
                                        {mediaGroups.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                                    activeDotIndex === index 
                                                        ? 'w-10 bg-primary' 
                                                        : 'w-3 bg-slate-300 hover:bg-slate-400'
                                                }`}
                                                aria-label={`Ir para slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}
            
            {/* Final CTA - Immersive */}
            <ImmersiveSection backgroundImage={IMAGES.home.cta.background}>
                <div className="max-w-4xl mx-auto text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                      <h2 className="font-armstrong text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight mb-8">
                          <KineticText text={TEXTS.home.cta.title}/>
                      </h2>
                      <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
                          {TEXTS.home.cta.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                          <Link to="/contato" className="inline-block bg-accent text-primary font-bold text-lg uppercase px-14 py-6 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect">
                              {TEXTS.global.buttons.requestBudget}
                          </Link>
                          <a href={`tel:${TEXTS.global.contact.phoneDisplay.replace(/\D/g, '')}`} className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold text-lg uppercase px-14 py-6 rounded-full transition-all duration-300 ease-in-out hover:bg-white/20 border-2 border-white/30">
                              {TEXTS.home.cta.buttonCall}
                          </a>
                      </div>
                    </div>
                </div>
            </ImmersiveSection>
            
            {/* Modal Lightbox for Team Section */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeInUp" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="media-viewer-description"
                    style={{animationDuration: '0.3s'}}
                >
                    <div 
                        ref={modalRef}
                        className="relative w-full h-full max-w-6xl max-h-[90vh]" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={closeModal} 
                            className="absolute -top-2 -right-2 md:top-0 md:-right-12 text-white bg-white/10 hover:bg-white/30 rounded-full p-2 transition-colors z-20" 
                            aria-label="Fechar visualizador"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="w-full h-full flex items-center justify-center">
                            {currentMedia.type === 'image' ? (
                                <ImageWithLoader
                                    src={currentMedia.src} 
                                    alt={currentMedia.alt}
                                    className="max-w-full max-h-full object-contain rounded-lg" 
                                />
                            ) : (
                                <video 
                                    key={currentMedia.src}
                                    src={currentMedia.src} 
                                    className="max-w-full max-h-full object-contain rounded-lg" 
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                    preload="metadata"
                                    aria-labelledby="media-viewer-description"
                                />
                            )}
                        </div>

                        <button 
                            onClick={showPrevMedia} 
                            className="absolute left-0 sm:-left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-all duration-300 shadow-lg hover:scale-110"
                            aria-label="Mídia anterior"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={showNextMedia} 
                            className="absolute right-0 sm:-right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-all duration-300 shadow-lg hover:scale-110"
                            aria-label="Próxima mídia"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>

                        <div id="media-viewer-description" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            {selectedMediaIndex + 1} / {mediaData.length}: {currentMedia.alt}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
