import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal, KineticText } from './ui/Animations';
import { ArrowRightIcon, MailIcon } from './icons';
import JobApplicationForm from './JobApplicationForm';
import ImageWithLoader from './ui/ImageWithLoader';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';
import { CONFIG } from './utils/config';


// --- Dados da Equipe (10 membros) ---
const teamMembers = [
  // Liderança
  {
    name: 'Hércules Souza',
    role: 'Diretor Técnico & Fundador',
    bio: TEXTS.team.leadership.bios.hercules,
    image: IMAGES.team.hercules,
    isLeadership: true,
  },
  {
    name: 'Cleide Ester',
    role: 'Diretora de Operações & Fundadora',
    bio: TEXTS.team.leadership.bios.cleide,
    image: IMAGES.team.cleide,
    isLeadership: true,
  },
  // Equipe
  {
    name: 'Camila Prado',
    role: 'Assistente Administrativo',
    image: IMAGES.team.camila,
    isLeadership: false,
  },
  {
    name: 'Jose Nilton',
    role: 'Encarregado',
    image: IMAGES.team.jose,
    isLeadership: false,
  },
  {
    name: 'Philippe Boechat',
    role: 'Instalador',
    image: IMAGES.team.philippe,
    isLeadership: false,
  },
  {
    name: 'Guilherme dos Santos',
    role: 'Instalador',
    image: IMAGES.team.guilherme,
    isLeadership: false,
  },
  {
    name: 'Marcelo da Corte',
    role: 'Instalador',
    image: IMAGES.team.marcelocorte,
    isLeadership: false,
  },
  {
    name: 'Kauã Da Corte',
    role: 'Instalador',
    image: IMAGES.team.kaua,
    isLeadership: false,
  },
  {
    name: 'Higor Paiva',
    role: 'Instalador',
    image: IMAGES.team.higor,
    isLeadership: false,
  },
  {
    name: 'Leandro Rocha',
    role: 'Instalador',
    image: IMAGES.team.leandro,
    isLeadership: false,
  },
  {
];


// --- Dados das Vagas ---
const jobOpenings = [
    {
        title: 'Ajudante de Instalação',
        description: 'Buscamos um profissional proativo e com vontade de aprender para auxiliar nossa equipe de instaladores em obras de alto padrão. Não exige experiência prévia na área, mas vivência em obras é um diferencial.',
    }
];

const leadership = teamMembers.filter(m => m.isLeadership);
const team = teamMembers.filter(m => !m.isLeadership);

// Helper to generate a storage key from a job title
const getStorageKey = (jobTitle: string) => `hceJobApplication_${jobTitle.replace(/\s+/g, '-')}`;

const TeamPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Nossa Equipe | Especialistas em Esquadrias de Alumínio | HCE';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Conheça a equipe de especialistas da HCE Esquadrias. Profissionais dedicados que garantem a precisão e qualidade em cada projeto, da fabricação à instalação.');
    }, []);

    const addToRefs = useScrollReveal();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');
    const [inProgressJobs, setInProgressJobs] = useState<Set<string>>(new Set());

    // Function to check localStorage for in-progress applications
    const checkInProgressApplications = () => {
        const inProgress = new Set<string>();
        jobOpenings.forEach(job => {
            const key = getStorageKey(job.title);
            try {
                if (localStorage.getItem(key)) {
                    inProgress.add(job.title);
                }
            } catch (e) {
                // Silently fail if localStorage is unavailable
            }
        });
        setInProgressJobs(inProgress);
    };

    // Check on mount
    useEffect(() => {
        checkInProgressApplications();
    }, []);


    const openForm = (jobTitle: string) => {
        setSelectedJob(jobTitle);
        setIsFormOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeForm = () => {
        setIsFormOpen(false);
        document.body.style.overflow = 'auto';
        // Re-check status when form is closed, in case user started but didn't submit.
        checkInProgressApplications(); 
    };
    
    // This will be called from the form upon successful submission or reset
    const handleApplicationEnd = (submittedJobTitle: string) => {
        const key = getStorageKey(submittedJobTitle);
        try {
            localStorage.removeItem(key);
        } catch (e) {}
        
        // Update the state immediately
        setInProgressJobs(prev => {
            const newSet = new Set(prev);
            newSet.delete(submittedJobTitle);
            return newSet;
        });
    };


    return (
        <div className="bg-white">
            {/* Cabeçalho */}
            <header className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text={TEXTS.team.header.title} />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        {TEXTS.team.header.description}
                    </p>
                </div>
            </header>

            {/* Seção de Liderança - SQUIRCLE STYLE */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                 <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
                    <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                        <KineticText text={TEXTS.team.leadership.title} />
                    </h2>
                     <p className="mt-4 text-lg text-body/80">
                        {TEXTS.team.leadership.description}
                    </p>
                </div>
                
                {/* Cards de Liderança */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {leadership.map((member, index) => (
                        <div 
                            key={member.name} 
                            ref={addToRefs} 
                            className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 scroll-reveal flex flex-col items-center text-center"
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Imagem Formato Squircle */}
                            <div className="w-48 h-48 sm:w-56 sm:h-56 mb-6 flex-shrink-0 overflow-hidden rounded-[2.5rem] shadow-md flex items-center justify-center">
                                <ImageWithLoader 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover object-center" 
                                    fetchPriority="high" 
                                />
                            </div>
                            
                            {/* Typography Hierarchy */}
                            <h3 className="font-armstrong text-3xl uppercase text-heading mb-2 font-bold tracking-tight">
                                {member.name}
                            </h3>
                            
                            <div className="text-accent font-semibold text-sm uppercase tracking-wider mb-5">
                                {member.role}
                            </div>
                            
                            <p className="text-body/90 leading-relaxed text-base md:text-lg max-w-md mx-auto">
                                "{member.bio}"
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Seção da Equipe */}
            <section className="bg-soft-gray py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
                        <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                            <KineticText text={TEXTS.team.specialists.title} />
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={member.name} ref={addToRefs} className="group text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="w-32 h-32 rounded-full mx-auto mb-4 shadow-sm overflow-hidden flex items-center justify-center">
                                    <ImageWithLoader src={member.image} alt={member.name} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" fetchPriority={index < 4 ? 'high' : 'auto'} />
                                </div>
                                <h3 className="font-armstrong text-lg uppercase text-heading mb-1">{member.name}</h3>
                                <p className="font-medium text-primary/70 text-xs uppercase tracking-wide">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seção de Recrutamento */}
            {CONFIG.pages.team.showCareers && (
                <ImmersiveSection backgroundImage={IMAGES.team.cta.background}>
                    <div id="carreiras" className="text-center">
                        <div ref={addToRefs} className="scroll-reveal">
                            {CONFIG.pages.team.openPositions ? (
                                <>
                                    <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                                    <KineticText text={TEXTS.team.careers.available.title} />
                                    </h2>
                                    <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                                        {TEXTS.team.careers.available.description}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                                    <KineticText text={TEXTS.team.careers.unavailable.title} />
                                    </h2>
                                    <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                                        {TEXTS.team.careers.unavailable.description}
                                    </p>
                                </>
                            )}
                        
                            <div className="max-w-3xl mx-auto">
                                {CONFIG.pages.team.openPositions ? (
                                    <div className="space-y-6 text-left">
                                        <h3 className="font-armstrong text-2xl uppercase text-accent text-center mb-8">{TEXTS.team.careers.available.label}</h3>
                                        {jobOpenings.map((job, index) => (
                                            <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
                                                <div>
                                                    <h4 className="font-bold text-xl text-white">{job.title}</h4>
                                                    <p className="text-white/70 mt-1">{job.description}</p>
                                                </div>
                                                <button onClick={() => openForm(job.title)} className="inline-flex items-center justify-center bg-accent text-primary font-bold text-sm uppercase px-6 py-3 rounded-full transition-all duration-300 ease-in-out hover:scale-105 shimmer-effect flex-shrink-0">
                                                    {inProgressJobs.has(job.title) ? TEXTS.team.careers.available.buttonContinue : TEXTS.team.careers.available.button}
                                                    <ArrowRightIcon className="w-4 h-4 ml-2"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                                        <h3 className="font-armstrong text-2xl uppercase text-accent mb-4">{TEXTS.team.careers.unavailable.boxTitle}</h3>
                                        <p className="text-white/90">
                                            {TEXTS.team.careers.unavailable.boxText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ImmersiveSection>
            )}

            {isFormOpen && (
                <JobApplicationForm 
                    jobTitle={selectedJob} 
                    onClose={closeForm}
                    onApplicationEnd={() => handleApplicationEnd(selectedJob)}
                />
            )}
        </div>
    );
};

export default TeamPage;
