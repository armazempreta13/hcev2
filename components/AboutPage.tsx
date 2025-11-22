import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal, KineticText } from './ui/Animations';
import ImageWithLoader from './ui/ImageWithLoader';
import { ArrowRightIcon } from './icons';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';

const AboutPage = () => {
    useEffect(() => {
        document.title = 'Sobre a HCE Esquadrias | Tradição e Inovação em Alumínio';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Conheça a história e os valores da HCE Esquadrias. Nossa paixão pela engenharia de precisão nos torna referência em esquadrias de alumínio em Brasília-DF.');
    }, []);

    const addToRefs = useScrollReveal();

    const nrStandards = [
        { name: 'NR 35', description: 'Trabalho em Altura', logo: IMAGES.partners.nr35 },
        { name: 'NR 12', description: 'Segurança em Máquinas', logo: IMAGES.partners.nr12 },
        { name: 'NR 18', description: 'Construção Civil', logo: IMAGES.partners.nr18 },
        { name: 'NR 06', description: 'Equipamento de Proteção Individual', logo: IMAGES.partners.nr06 },
    ];

    return (
        <div className="bg-soft-gray pt-28 sm:pt-32 md:pt-40">
            <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <ImageWithLoader
                    src={IMAGES.about.hero}
                    alt="Equipe da HCE Esquadrias trabalhando em uma grande obra de esquadrias de alumínio."
                    className="absolute inset-0 w-full h-full object-cover"
                    // FIX: Corrected typo 'fetchpriority' to 'fetchPriority'.
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-primary opacity-70"></div>
                <div ref={addToRefs} className="relative z-10 text-white text-center px-4 scroll-reveal">
                     <h1 className="font-armstrong text-4xl md:text-6xl uppercase tracking-wider">
                        <KineticText text={TEXTS.about.hero.title} />
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
                        {TEXTS.about.hero.description}
                    </p>
                </div>
            </div>

            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div ref={addToRefs} className="scroll-reveal">
                            <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-wider mb-8">
                                <KineticText text={TEXTS.about.history.title} />
                            </h2>
                            <div className="space-y-6 text-body text-lg leading-relaxed">
                                {TEXTS.about.history.paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                        <div ref={addToRefs} className="relative h-[400px] lg:h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl scroll-reveal" style={{transitionDelay: '200ms'}}>
                            <ImageWithLoader
                                src={IMAGES.about.showroom} 
                                alt="Showroom moderno da HCE Esquadrias" 
                                width="600" 
                                height="750" 
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute bottom-8 left-8 w-56 bg-white/25 backdrop-blur-lg rounded-3xl hidden lg:flex items-center justify-center py-4 px-6 border border-white/30 shadow-xl">
                                <ImageWithLoader
                                    src={IMAGES.identity.logoWhite}
                                    alt="HCE Esquadrias Logo"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div ref={addToRefs} className="text-center mb-16 md:mb-20 scroll-reveal">
                        <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-white tracking-wider">
                            <KineticText text={TEXTS.about.pillars.title} />
                        </h2>
                    </div>
                    <div ref={addToRefs} className="grid grid-cols-1 md:grid-cols-3 gap-12 scroll-reveal" style={{transitionDelay: '200ms'}}>
                        <div className="text-center p-8">
                            <h3 className="font-armstrong text-3xl uppercase text-accent mb-4">{TEXTS.about.pillars.mission.title}</h3>
                            <p className="text-light-bg/80 text-lg">
                                {TEXTS.about.pillars.mission.text}
                            </p>
                        </div>
                        <div className="text-center p-8 border-y md:border-y-0 md:border-x border-slate-700 my-8 md:my-0 py-12 md:py-8">
                            <h3 className="font-armstrong text-3xl uppercase text-accent mb-4">{TEXTS.about.pillars.vision.title}</h3>
                            <p className="text-light-bg/80 text-lg">
                                {TEXTS.about.pillars.vision.text}
                            </p>
                        </div>
                        <div className="text-center p-8">
                            <h3 className="font-armstrong text-3xl uppercase text-accent mb-4">{TEXTS.about.pillars.values.title}</h3>
                            <p className="text-light-bg/80 text-lg">
                               {TEXTS.about.pillars.values.text}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 md:mb-20 scroll-reveal">
                        <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-wider">
                            <KineticText text={TEXTS.about.safety.title} />
                        </h2>
                        <p className="mt-6 text-lg sm:text-xl text-body max-w-2xl mx-auto">
                            {TEXTS.about.safety.description}
                        </p>
                    </div>
                    <div ref={addToRefs} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        {nrStandards.map((standard, index) => (
                            <div key={index} className="flex flex-col items-center justify-start text-center p-4 sm:p-6 bg-soft-gray rounded-2xl border border-slate-200/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <ImageWithLoader 
                                    src={standard.logo} 
                                    alt={`Selo ${standard.name}`} 
                                    className="h-20 w-20 object-contain mb-4" 
                                />
                                <h4 className="font-bold text-heading">{standard.name}</h4>
                                <p className="text-xs sm:text-sm text-body leading-tight">{standard.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - Consistent with other pages */}
            <ImmersiveSection backgroundImage={IMAGES.about.cta.background}>
                <div className="text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                            <KineticText text={TEXTS.about.cta.title} />
                        </h2>
                        <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            {TEXTS.about.cta.description}
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
        </div>
    );
};

export default AboutPage;