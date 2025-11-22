import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WhatsAppIcon, ArrowRightIcon, MailIcon, PhoneIcon, LocationIcon } from './icons';
import { KineticText, useScrollReveal } from './ui/Animations';
import { calculateEstimate, serviceOptions, qualityLevels, PricingResult } from './utils/pricingEstimator';
import { FaRulerCombined, FaPlus, FaMinus, FaBoxOpen, FaHardHat, FaCalendarAlt } from 'react-icons/fa';
import { TEXTS } from './utils/texts';
import { CONFIG } from './utils/config';

const WHATSAPP_NUMBER = TEXTS.global.contact.phoneDisplay.replace(/\D/g, '');

// ==================== COMPONENTS AUXILIARES ====================

const AnimatedNumber: React.FC<{ value: number; duration?: number; formatter: (v: number) => string }> = ({ value, duration = 400, formatter }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        let startTime: number | null = null;
        
        // Easing function for a smoother animation
        const easeOutQuad = (t: number) => t * (2 - t);

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const current = startValue + (endValue - startValue) * easedProgress;
            
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                 setDisplayValue(endValue);
                 prevValueRef.current = endValue;
            }
        };
        
        // No need to animate if value is the same
        if (startValue !== endValue) {
            requestAnimationFrame(animate);
        }

        // Cleanup function is not strictly needed but good practice
        return () => {
             prevValueRef.current = value;
        };
    }, [value, duration]);

    return <span>{formatter(displayValue)}</span>;
};


const ResultCard: React.FC<{ result: PricingResult | null }> = ({ result }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const AnimatedCurrency: React.FC<{value: number}> = ({ value }) => (
        <AnimatedNumber value={value} formatter={formatCurrency} />
    );

    const AnimatedDays: React.FC<{value: number}> = ({ value }) => (
        <AnimatedNumber value={value} formatter={v => `${Math.round(v)} dias úteis`} />
    );

    if (!result) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200/50 text-center flex flex-col justify-center items-center min-h-[530px] lg:sticky lg:top-32">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <FaRulerCombined className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-armstrong text-2xl uppercase text-heading mb-2">{TEXTS.contact.pricingPage.resultCard.waitingTitle}</h3>
                <p className="text-body max-w-xs">{TEXTS.contact.pricingPage.resultCard.waitingDesc}</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200/50 lg:sticky lg:top-32 animate-fadeInUp">
            <h3 className="font-armstrong text-xl sm:text-2xl uppercase text-heading mb-4">{TEXTS.contact.pricingPage.resultCard.title}</h3>
            
            <div className="text-center bg-gradient-to-br from-primary to-slate-800 text-white py-6 px-4 rounded-2xl mb-8 shadow-lg">
                <p className="text-sm uppercase text-accent font-semibold tracking-wider">{TEXTS.contact.pricingPage.resultCard.estimatedValue}</p>
                <div className="text-4xl md:text-5xl font-bold font-poppins tracking-tighter my-2">
                   <AnimatedCurrency value={result.total} />
                </div>
                <p className="text-xs text-white/70 mt-1">{TEXTS.contact.pricingPage.resultCard.disclaimer}</p>
            </div>
            
            <div className="space-y-1">
                <h4 className="font-bold text-heading mb-3 text-lg">{TEXTS.contact.pricingPage.resultCard.detailsTitle}</h4>
                <div className="flex justify-between items-center text-body border-b border-slate-200 py-3">
                    <div className="flex items-center text-sm sm:text-base">
                        <FaBoxOpen className="w-5 h-5 mr-3 text-primary/60 flex-shrink-0" />
                        <span>{TEXTS.contact.pricingPage.resultCard.materialCost}</span>
                    </div>
                    <span className="font-semibold text-heading text-base"><AnimatedCurrency value={result.materialCost} /></span>
                </div>
                <div className="flex justify-between items-center text-body border-b border-slate-200 py-3">
                    <div className="flex items-center text-sm sm:text-base">
                        <FaHardHat className="w-5 h-5 mr-3 text-primary/60 flex-shrink-0" />
                        <span>{TEXTS.contact.pricingPage.resultCard.laborCost}</span>
                    </div>
                    <span className="font-semibold text-heading text-base"><AnimatedCurrency value={result.laborCost} /></span>
                </div>
                <div className="flex justify-between items-center text-body py-3">
                    <div className="flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="w-5 h-5 mr-3 text-primary/60 flex-shrink-0" />
                        <span>{TEXTS.contact.pricingPage.resultCard.deadline}</span>
                    </div>
                    <span className="font-semibold text-heading text-base"><AnimatedDays value={result.estimatedDays} /></span>
                </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-8 text-center">
                {TEXTS.contact.pricingPage.resultCard.finalDisclaimer}
            </p>
        </div>
    );
};

// ==================== PÁGINA ORIGINAL (CALCULADORA) ====================
const PricingEstimatorPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Orçamento Rápido | HCE Esquadrias';
    }, []);

    const addToRefs = useScrollReveal();
    const [selectedService, setSelectedService] = useState(serviceOptions[0].id);
    const [area, setArea] = useState(20);
    const [quality, setQuality] = useState(qualityLevels[0].id);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactInfo, setContactInfo] = useState({ name: '', phone: '' });

    const estimate = useMemo(() => {
        return calculateEstimate(selectedService, area, quality);
    }, [selectedService, area, quality]);

    const handleWhatsAppRedirect = () => {
        const serviceName = serviceOptions.find(s => s.id === selectedService)?.name;
        const qualityName = qualityLevels.find(q => q.id === quality)?.name;
        
        const message = `
*Orçamento Rápido (via Site)*

Olá, HCE Esquadrias!
Gostaria de um orçamento detalhado com base na seguinte estimativa:

*DADOS DO PROJETO*
- *Serviço:* ${serviceName}
- *Área Aproximada:* ${area} m²
- *Nível de Acabamento:* ${qualityName}
- *Valor Estimado:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate?.total ?? 0)}

*MEUS DADOS*
- *Nome:* ${contactInfo.name}
- *Telefone:* ${contactInfo.phone}

Aguardo o contato para agendarmos uma visita técnica. Obrigado!
        `.trim().replace(/^\s+/gm, '');

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
         const formattedValue = value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{4,5})(\d{4})/, '$1-$2')
            .slice(0, 15);
        setContactInfo(prev => ({...prev, phone: formattedValue}));
    };

    const isContactFormValid = contactInfo.name.trim() !== '' && /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(contactInfo.phone);

    return (
        <div className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header ref={addToRefs} className="text-center mb-12 max-w-4xl mx-auto scroll-reveal">
                    <h1 className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider">
                        <KineticText text={TEXTS.contact.pricingPage.header.title} />
                    </h1>
                    <p className="mt-4 text-lg text-body/80">
                        {TEXTS.contact.pricingPage.header.description}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
                    <div ref={addToRefs} className="lg:col-span-2 space-y-12 scroll-reveal" style={{transitionDelay: '200ms'}}>
                        {/* 1. Tipo de Serviço */}
                        <div>
                            <h2 className="font-armstrong text-2xl uppercase text-heading mb-6">{TEXTS.contact.pricingPage.steps.one}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {serviceOptions.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col items-center justify-center text-center aspect-square ${selectedService === service.id ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white text-heading hover:border-primary/50 border-slate-200'}`}
                                    >
                                        <service.icon className={`w-10 h-10 mb-3 transition-colors ${selectedService === service.id ? 'text-accent' : 'text-primary/70'}`} />
                                        <span className="font-bold text-sm leading-tight">{service.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Área do Projeto */}
                        <div>
                             <h2 className="font-armstrong text-2xl uppercase text-heading mb-6">{TEXTS.contact.pricingPage.steps.two}</h2>
                             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-body">{TEXTS.contact.pricingPage.steps.areaLabel}</span>
                                    <span className="font-bold text-2xl text-primary">{area} m²</span>
                                </div>
                                <div className="flex items-center gap-4">
                                     <button onClick={() => setArea(p => Math.max(1, p - 1))} className="p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300"><FaMinus/></button>
                                     <input
                                        type="range"
                                        min="1"
                                        max="200"
                                        value={area}
                                        onChange={e => setArea(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-lg accent-primary"
                                    />
                                    <button onClick={() => setArea(p => Math.min(200, p + 1))} className="p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300"><FaPlus/></button>
                                </div>
                             </div>
                        </div>

                        {/* 3. Nível de Acabamento */}
                        <div>
                             <h2 className="font-armstrong text-2xl uppercase text-heading mb-6">{TEXTS.contact.pricingPage.steps.three}</h2>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {qualityLevels.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => setQuality(level.id)}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${quality === level.id ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white text-heading hover:border-primary/50 border-slate-200'}`}
                                    >
                                        <div className="flex items-center mb-2">
                                            <level.icon className={`w-6 h-6 mr-3 ${quality === level.id ? 'text-accent' : 'text-primary/70'}`}/>
                                            <h4 className="font-bold text-lg">{level.name}</h4>
                                        </div>
                                        <p className={`text-xs ${quality === level.id ? 'text-white/80' : 'text-body'}`}>{level.description}</p>
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* 4. Próximo Passo */}
                        <div className="pt-6 border-t border-slate-200">
                             <h2 className="font-armstrong text-2xl uppercase text-heading mb-4">{TEXTS.contact.pricingPage.steps.four}</h2>
                             <p className="text-body mb-6">{TEXTS.contact.pricingPage.nextStepText}</p>

                            {!showContactForm ? (
                                <button onClick={() => setShowContactForm(true)} className="inline-flex items-center justify-center bg-primary text-white font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shimmer-effect">
                                    {TEXTS.contact.pricingPage.buttonCalculate}
                                    <ArrowRightIcon className="w-5 h-5 ml-2"/>
                                </button>
                            ) : (
                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeInUp">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-bold text-heading mb-2 block">{TEXTS.contact.pricingPage.form.nameLabel}</label>
                                        <input type="text" id="name" value={contactInfo.name} onChange={e => setContactInfo(p => ({...p, name: e.target.value}))} className="w-full border-2 border-slate-300 rounded-lg p-3 focus:border-primary focus:ring-primary/20 transition" />
                                    </div>
                                     <div>
                                        <label htmlFor="phone" className="text-sm font-bold text-heading mb-2 block">{TEXTS.contact.pricingPage.form.phoneLabel}</label>
                                        <input type="tel" id="phone" value={contactInfo.phone} onChange={handlePhoneChange} placeholder="(XX) XXXXX-XXXX" className="w-full border-2 border-slate-300 rounded-lg p-3 focus:border-primary focus:ring-primary/20 transition" />
                                    </div>
                                    <button onClick={handleWhatsAppRedirect} disabled={!isContactFormValid} className="w-full inline-flex items-center justify-center bg-green-500 text-white font-bold text-base uppercase px-10 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-600 shimmer-effect disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100">
                                        <WhatsAppIcon className="w-6 h-6 mr-3"/>
                                        {TEXTS.contact.pricingPage.form.whatsappButton}
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                    <div ref={addToRefs} className="lg:col-span-1 scroll-reveal" style={{transitionDelay: '400ms'}}>
                        <ResultCard result={estimate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== PÁGINA SIMPLIFICADA (MANUTENÇÃO) ====================
const SimpleContactPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Fale Conosco | HCE Esquadrias';
    }, []);

    const addToRefs = useScrollReveal();
    const [form, setForm] = useState({ name: '', phone: '', message: '' });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
         const formattedValue = value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{4,5})(\d{4})/, '$1-$2')
            .slice(0, 15);
        setForm(prev => ({...prev, phone: formattedValue}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `
*Contato via Site (Formulário Simplificado)*

*Nome:* ${form.name}
*Telefone:* ${form.phone}
*Mensagem:*
${form.message}
        `.trim();

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    };

    const isValid = form.name.trim() && form.phone.trim() && form.message.trim();

    return (
        <div className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header ref={addToRefs} className="text-center mb-12 max-w-3xl mx-auto scroll-reveal">
                    <h1 className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider">
                        <KineticText text={TEXTS.contact.simplePage.header.title} />
                    </h1>
                    <p className="mt-4 text-lg text-body/80">
                        {TEXTS.contact.simplePage.header.description}
                    </p>
                </header>

                {/* Modified Grid Layout for Perfect Bottom Alignment */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left Column: Informações de Contato */}
                    {/* Changed to flex-col with h-full to allow stretching */}
                    <div ref={addToRefs} className="flex flex-col h-full gap-8 scroll-reveal">
                        
                        {/* Box 1: Channels */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200/50">
                            <h3 className="font-armstrong text-2xl uppercase text-heading mb-6">{TEXTS.contact.simplePage.channels.title}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <WhatsAppIcon className="w-6 h-6 text-primary"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-heading">{TEXTS.contact.simplePage.channels.whatsapp.title}</h4>
                                        <p className="text-body text-sm mb-1">{TEXTS.contact.simplePage.channels.whatsapp.desc}</p>
                                        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-accent font-bold hover:underline">{TEXTS.global.contact.phoneDisplay}</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <MailIcon className="w-6 h-6 text-primary"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-heading">{TEXTS.contact.simplePage.channels.email.title}</h4>
                                        <p className="text-body text-sm mb-1">{TEXTS.contact.simplePage.channels.email.desc}</p>
                                        <a href={`mailto:${TEXTS.global.contact.email}`} className="text-accent font-bold hover:underline">{TEXTS.global.contact.email}</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <LocationIcon className="w-6 h-6 text-primary"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-heading">{TEXTS.contact.simplePage.channels.location.title}</h4>
                                        <p className="text-body text-sm">{TEXTS.contact.simplePage.channels.location.desc}</p>
                                        <p className="text-body text-sm text-slate-500">{TEXTS.global.contact.addressDetails}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Box 2: Hours */}
                        {/* Added flex-1 to force it to stretch to the bottom, ensuring alignment with the form */}
                        <div className="bg-primary text-white p-8 rounded-3xl shadow-lg flex-1 flex flex-col justify-center">
                            <h3 className="font-armstrong text-xl uppercase mb-4">{TEXTS.footer.titles.serviceHours}</h3>
                            <p className="opacity-90 mb-2">{TEXTS.global.contact.hours.weekdays}</p>
                            <p className="opacity-90">{TEXTS.global.contact.hours.saturday}</p>
                        </div>
                    </div>

                    {/* Right Column: Formulário Simplificado */}
                    {/* Added h-full to ensure the grid cells match heights */}
                    <div ref={addToRefs} className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/50 scroll-reveal h-full" style={{transitionDelay: '200ms'}}>
                        <h3 className="font-armstrong text-2xl uppercase text-heading mb-6">{TEXTS.contact.simplePage.form.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="simple-name" className="block text-sm font-bold text-heading mb-2">{TEXTS.contact.pricingPage.form.nameLabel}</label>
                                <input 
                                    type="text" 
                                    id="simple-name" 
                                    className="w-full border-2 border-slate-300 rounded-xl p-3 focus:border-primary focus:ring-primary/20 transition bg-slate-50"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder={TEXTS.contact.simplePage.form.namePlaceholder}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="simple-phone" className="block text-sm font-bold text-heading mb-2">{TEXTS.contact.pricingPage.form.phoneLabel}</label>
                                <input 
                                    type="tel" 
                                    id="simple-phone" 
                                    className="w-full border-2 border-slate-300 rounded-xl p-3 focus:border-primary focus:ring-primary/20 transition bg-slate-50"
                                    value={form.phone}
                                    onChange={handlePhoneChange}
                                    placeholder={TEXTS.contact.simplePage.form.phonePlaceholder}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="simple-msg" className="block text-sm font-bold text-heading mb-2">{TEXTS.contact.simplePage.form.msgLabel}</label>
                                <textarea 
                                    id="simple-msg" 
                                    rows={5}
                                    className="w-full border-2 border-slate-300 rounded-xl p-3 focus:border-primary focus:ring-primary/20 transition bg-slate-50 resize-none"
                                    value={form.message}
                                    onChange={e => setForm({...form, message: e.target.value})}
                                    placeholder={TEXTS.contact.simplePage.form.msgPlaceholder}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={!isValid}
                                className="w-full inline-flex items-center justify-center bg-green-500 text-white font-bold text-base uppercase px-8 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-600 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <WhatsAppIcon className="w-5 h-5 mr-2"/>
                                {TEXTS.contact.simplePage.form.button}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==================== COMPONENTE PRINCIPAL (SWITCH) ====================
const ContactPage: React.FC = () => {
    if (CONFIG.features.pricingEstimator) {
        return <PricingEstimatorPage />;
    } else {
        return <SimpleContactPage />;
    }
};

export default ContactPage;