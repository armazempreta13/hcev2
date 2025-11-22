import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from './icons';
import { useScrollReveal, KineticText } from './ui/Animations';
import ImageWithLoader from './ui/ImageWithLoader';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';

// Helper to map text data to the visual structure
const servicesList = [
    {
        id: 'esquadrias-aluminio',
        ...TEXTS.services.items.esquadrias,
        image: IMAGES.services.details.esquadrias,
        imageAlt: 'Janela de alumínio em uma sala de estar moderna'
    },
    {
        id: 'ripados-brises',
        ...TEXTS.services.items.brises,
        image: IMAGES.services.details.brises,
        imageAlt: 'Fachada com brises de alumínio horizontais'
    },
    {
        id: 'guarda-corpos',
        ...TEXTS.services.items.guardaCorpo,
        image: IMAGES.services.details.guardaCorpo,
        imageAlt: 'Guarda-corpo de vidro em uma sacada com vista'
    },
    {
        id: 'pele-de-vidro',
        ...TEXTS.services.items.peleVidro,
        image: IMAGES.services.details.peleVidro,
        imageAlt: 'Fachada de um prédio comercial com pele de vidro'
    },
];

const esquadriaTypes = [
    {
        title: TEXTS.services.typesSection.items[0].title,
        description: TEXTS.services.typesSection.items[0].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Janela de correr de alumínio em um quarto com vista para a cidade.'
    },
    {
        title: TEXTS.services.typesSection.items[1].title,
        description: TEXTS.services.typesSection.items[1].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Janela maxim-ar de alumínio em um banheiro moderno'
    },
    {
        title: TEXTS.services.typesSection.items[2].title,
        description: TEXTS.services.typesSection.items[2].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Porta de correr de vidro e alumínio conectando sala de estar e varanda'
    },
    {
        title: TEXTS.services.typesSection.items[3].title,
        description: TEXTS.services.typesSection.items[3].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Porta pivotante de alumínio em uma fachada residencial de luxo'
    },
    {
        title: TEXTS.services.typesSection.items[4].title,
        description: TEXTS.services.typesSection.items[4].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Painel de vidro fixo em uma sala com pé-direito duplo'
    },
    {
        title: TEXTS.services.typesSection.items[5].title,
        description: TEXTS.services.typesSection.items[5].desc,
        image: IMAGES.services.types.placeholder,
        imageAlt: 'Portão de garagem basculante de alumínio em estilo contemporâneo'
    }
];

const ServicesPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Serviços de Esquadrias de Alumínio | Portas, Janelas, Fachadas';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Soluções completas em esquadrias de alumínio: Portas, Janelas (Linha Inova), Pele de Vidro, Guarda-corpos e Brises. Qualidade e performance para seu projeto.');
    }, []);

    const addToRefs = useScrollReveal();

    return (
        <div className="bg-white">
            <header className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text={TEXTS.services.header.title} />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        {TEXTS.services.header.description}
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
                {servicesList.map((service, index) => (
                    <section key={index} id={service.id} ref={addToRefs} className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center scroll-reveal">
                        <div className={`relative h-96 lg:h-[500px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <ImageWithLoader 
                                src={service.image} 
                                alt={service.imageAlt} 
                                width="800" height="600" 
                                className="w-full h-full object-cover rounded-4xl shadow-2xl"
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                            />
                            <div className={`absolute bottom-6 w-48 bg-white/25 backdrop-blur-lg rounded-3xl hidden lg:flex items-center justify-center py-3 px-5 border border-white/30 shadow-xl ${index % 2 === 1 ? 'left-6' : 'right-6'}`}>
                                <ImageWithLoader
                                    src={IMAGES.identity.logoWhite}
                                    alt="HCE Esquadrias Logo"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                                <KineticText text={service.title} />
                            </h2>
                            <p className="text-body/90 text-lg leading-relaxed">{service.description}</p>
                            <ul className="space-y-3 pt-4">
                                {service.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center text-body font-medium">
                                        <CheckCircleIcon className="w-6 h-6 mr-3 text-primary/70 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </main>

            {/* Nova Seção de Tipos de Esquadrias */}
            <section className="bg-soft-gray py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
                        <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                            <KineticText text={TEXTS.services.typesSection.title} />
                        </h2>
                        <p className="mt-4 text-lg text-body/80">
                            {TEXTS.services.typesSection.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {esquadriaTypes.map((type, index) => (
                            <div key={index} ref={addToRefs} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="relative h-64">
                                    <ImageWithLoader 
                                        src={type.image} 
                                        alt={type.imageAlt} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="font-armstrong text-2xl uppercase text-heading mb-3">{type.title}</h3>
                                    <p className="text-body text-base leading-relaxed">{type.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seção CTA com ImmersiveSection */}
            <ImmersiveSection backgroundImage={IMAGES.services.cta.background}>
                <div className="text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                      <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                         <KineticText text={TEXTS.services.cta.title} />
                      </h2>
                      <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                          {TEXTS.services.cta.description}
                      </p>
                      <div>
                          <Link 
                              to="/contato"
                              className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect"
                          >
                             {TEXTS.global.buttons.requestBudget}
                             <ArrowRightIcon className="w-5 h-5 ml-2"/>
                          </Link>
                      </div>
                    </div>
                </div>
            </ImmersiveSection>
        </div>
    );
};

export default ServicesPage;