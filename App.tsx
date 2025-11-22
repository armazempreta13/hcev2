
import React, { useEffect, Suspense, lazy, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import Loader from './components/ui/Loader';
import HomePage from './components/HomePage';
import { useFocusTrap } from './components/ui/hooks';
import AnimatedGridBackground from './components/ui/AnimatedGridBackground';
import ImageWithLoader from './components/ui/ImageWithLoader';
import { IMAGES } from './components/utils/images';
import { TEXTS } from './components/utils/texts';
import { CONFIG } from './components/utils/config';
import { 
    hasUserConsented, 
    getConsentState, 
    saveConsentState, 
    updateGtagConsent, 
    defaultConsent,
    ConsentState 
} from './components/utils/consent';

// Lazy load page components for code-splitting
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const TeamPage = lazy(() => import('./components/TeamPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./components/TermsOfUsePage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const SocialFollowAlert = lazy(() => import('./components/ui/SocialFollowAlert'));
const CookieConsent = lazy(() => import('./components/ui/CookieConsent'));

// Add gtag to window interface for TypeScript
declare global {
    interface Window { 
        gtag: (...args: any[]) => void;
    }
}

// --- Full Screen Maintenance Component ---
const MaintenanceScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-primary text-white flex flex-col items-center justify-center p-4 overflow-hidden font-poppins">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
             {CONFIG.ui.enableParticles && <AnimatedGridBackground />}
        </div>
        
        <div className="relative z-10 max-w-3xl w-full text-center space-y-8 animate-fadeInUp bg-primary/30 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
                 <ImageWithLoader 
                    src={IMAGES.identity.logoColor} 
                    alt="HCE Esquadrias Logo" 
                    className="h-20 md:h-24 w-auto drop-shadow-lg" 
                />
            </div>

            <h1 className="font-armstrong text-4xl md:text-6xl uppercase tracking-wider text-white mb-4">
                {TEXTS.maintenance.title}
            </h1>
            
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6"></div>

            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
                {TEXTS.maintenance.description}
            </p>
            
            <p className="text-base text-slate-400 italic">
                {TEXTS.maintenance.footer}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-10">
                <a 
                    href="https://wa.me/5561993619554" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/20"
                >
                    <FaWhatsapp className="w-6 h-6" />
                    <span>{TEXTS.global.buttons.whatsapp}</span>
                </a>
                
                <a 
                    href="mailto:hceesquadrias@yahoo.com"
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105"
                >
                    <FaEnvelope className="w-6 h-6" />
                    <span>{TEXTS.global.buttons.email}</span>
                </a>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-500 uppercase tracking-widest">
                {TEXTS.global.brandName} &copy; {new Date().getFullYear()}
            </div>
        </div>
    </div>
);

// --- Cookie Preferences Modal ---
const CookiePreferencesModal: React.FC<{
    show: boolean;
    onClose: () => void;
    onSave: (prefs: ConsentState) => void;
    initialState: ConsentState;
}> = ({ show, onClose, onSave, initialState }) => {
    const modalRef = useFocusTrap(show);
    const [prefs, setPrefs] = useState<ConsentState>(initialState);

    useEffect(() => {
        if (show) {
            setPrefs(initialState);
        }
    }, [initialState, show]);

    if (!show) return null;

    const handleSave = () => {
        onSave(prefs);
    };

    const togglePref = (key: keyof ConsentState) => {
        if (key === 'necessary') return; // Always locked
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const switchBase = "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";
    const switchKnob = "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out";
    const switchOn = "bg-accent";
    const switchOff = "bg-slate-300";

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1200] flex items-center justify-center p-4 animate-fadeInUp"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
        >
            <div
                ref={modalRef}
                className="relative bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <h3 id="cookie-prefs-title" className="text-xl font-bold text-heading mb-4">{TEXTS.cookieModal.title}</h3>
                <p className="text-body mb-6 text-sm">{TEXTS.cookieModal.description}</p>

                <div className="space-y-6">
                    {/* Necessary */}
                    <div className="flex justify-between items-start">
                        <div className="pr-4">
                            <h4 className="font-bold text-heading text-sm">{TEXTS.cookieModal.sections.necessary.title}</h4>
                            <p className="text-xs text-body mt-1">{TEXTS.cookieModal.sections.necessary.desc}</p>
                        </div>
                        <button type="button" disabled className={`${switchBase} bg-slate-400 opacity-50 cursor-not-allowed`}>
                            <span className={`${switchKnob} translate-x-5`} />
                        </button>
                    </div>

                    {/* Analytics */}
                    <div className="flex justify-between items-start">
                         <div className="pr-4">
                            <h4 className="font-bold text-heading text-sm">{TEXTS.cookieModal.sections.analytics.title}</h4>
                            <p className="text-xs text-body mt-1">{TEXTS.cookieModal.sections.analytics.desc}</p>
                        </div>
                         <button
                            type="button"
                            className={`${switchBase} ${prefs.analytics ? switchOn : switchOff}`}
                            onClick={() => togglePref('analytics')}
                            aria-checked={prefs.analytics}
                            role="switch"
                        >
                            <span className={`${switchKnob} ${prefs.analytics ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                     {/* Functional */}
                     <div className="flex justify-between items-start">
                         <div className="pr-4">
                            <h4 className="font-bold text-heading text-sm">{TEXTS.cookieModal.sections.functional.title}</h4>
                            <p className="text-xs text-body mt-1">{TEXTS.cookieModal.sections.functional.desc}</p>
                        </div>
                         <button
                            type="button"
                            className={`${switchBase} ${prefs.functional ? switchOn : switchOff}`}
                            onClick={() => togglePref('functional')}
                            aria-checked={prefs.functional}
                            role="switch"
                        >
                            <span className={`${switchKnob} ${prefs.functional ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex justify-between items-start">
                         <div className="pr-4">
                            <h4 className="font-bold text-heading text-sm">{TEXTS.cookieModal.sections.marketing.title}</h4>
                            <p className="text-xs text-body mt-1">{TEXTS.cookieModal.sections.marketing.desc}</p>
                        </div>
                         <button
                            type="button"
                            className={`${switchBase} ${prefs.marketing ? switchOn : switchOff}`}
                            onClick={() => togglePref('marketing')}
                            aria-checked={prefs.marketing}
                            role="switch"
                        >
                            <span className={`${switchKnob} ${prefs.marketing ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg font-semibold text-sm text-body hover:bg-slate-100 transition-colors">{TEXTS.cookieModal.buttons.cancel}</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-heading transition-colors shadow-lg">{TEXTS.cookieModal.buttons.save}</button>
                </div>
            </div>
        </div>
    );
}


const App: React.FC = () => {
  const location = useLocation();

  // Consent Management State
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [isCookieBannerVisual, setIsCookieBannerVisual] = useState(false); // Tracks visual state (animation)
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [consentState, setConsentState] = useState<ConsentState>(defaultConsent);
  
  // Features tied to consent
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasChatInteracted, setHasChatInteracted] = useState(false);

  // =========================================
  // IF MAINTENANCE MODE IS ON, RENDER ONLY THE MAINTENANCE SCREEN
  // =========================================
  if (CONFIG.mode.maintenance) {
      return <MaintenanceScreen />;
  }

  useEffect(() => {
    // Scroll Handling
    const scrollToElement = (id: string, attempt = 0) => {
        if (attempt > 20) return;
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 50);
        } else {
            setTimeout(() => scrollToElement(id, attempt + 1), 100);
        }
    };
    if (location.hash) {
      scrollToElement(location.hash.substring(1));
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  // --- INITIALIZE CONSENT ---
  useEffect(() => {
      // 1. Load saved state immediately
      const savedState = getConsentState();
      setConsentState(savedState);

      // 2. Apply current state to GTAG (ensures persistency on reload)
      updateGtagConsent(savedState);

      // 3. Show banner if no user decision yet AND config allows it
      if (CONFIG.marketing.showCookieBanner && !hasUserConsented()) {
          setShowCookieBanner(true);
      }
  }, []);
  

  // --- SOCIAL ALERT LOGIC (Requires Marketing/Analytics usually, or just interaction) ---
  useEffect(() => {
    if (!CONFIG.marketing.showSocialAlert) return;

    // Only show if user accepted at least Analytics OR Functional cookies to be polite
    if (!consentState.analytics && !consentState.functional) return;

    try {
        const hasBeenDismissed = localStorage.getItem('socialAlertDismissed') === 'true';
        if (hasBeenDismissed) return;
        const alertTimer = setTimeout(() => setIsAlertVisible(true), 15000);
        return () => clearTimeout(alertTimer);
    } catch (e) {
        // Silent fail
    }
  }, [consentState]);

  const handleCloseAlert = () => {
      setIsAlertVisible(false);
      // Only save dismissal if we have functional consent
      if (consentState.functional) {
        try {
            localStorage.setItem('socialAlertDismissed', 'true');
        } catch (e) {}
      }
  };

  // --- CHAT LOGIC ---
  const openChat = () => {
    setIsChatOpen(true);
    if (!hasChatInteracted) {
      setHasChatInteracted(true);
      // Only save interaction state if functional consent is granted
      if (consentState.functional) {
          try {
            localStorage.setItem('hceChatInteracted', 'true');
          } catch (error) {}
      }
    }
  };

  useEffect(() => {
      // Load initial chat interaction state if allowed
      if (consentState.functional) {
          try {
              setHasChatInteracted(localStorage.getItem('hceChatInteracted') === 'true');
          } catch {}
      }
  }, [consentState.functional]);

  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => (isChatOpen ? closeChat() : openChat());

  // --- CONSENT HANDLERS ---
  const handleAcceptAll = () => {
      console.log('✅ Usuário clicou em: Aceitar Tudo');
      const newState: ConsentState = {
          necessary: true,
          analytics: true,
          marketing: true,
          functional: true
      };
      saveConsentState(newState);
      setConsentState(newState);
      setShowCookieBanner(false);
  };

  const handleAcceptNecessary = () => {
      console.log('✅ Usuário clicou em: Apenas Necessários');
      const newState: ConsentState = {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false
      };
      saveConsentState(newState);
      setConsentState(newState);
      setShowCookieBanner(false);
  };

  const handleOpenPreferences = () => {
      setShowCookieBanner(false);
      setShowPreferencesModal(true);
  };

  const handleSavePreferences = (prefs: ConsentState) => {
      console.log('✅ Usuário salvou preferências personalizadas', prefs);
      saveConsentState(prefs);
      setConsentState(prefs);
      setShowPreferencesModal(false);
  };

  const handleClosePreferences = () => {
      setShowPreferencesModal(false);
      // If they haven't consented yet, show the banner again
      if (!hasUserConsented() && CONFIG.marketing.showCookieBanner) {
          setShowCookieBanner(true);
      }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={CONFIG.ui.showLoader ? <Loader /> : <div className="min-h-screen bg-soft-gray"/>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/equipe" element={<TeamPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      
      {CONFIG.features.floatingActions && (
          <FloatingActions 
            isChatOpen={isChatOpen} 
            toggleChat={toggleChat}
            hasInteracted={hasChatInteracted}
            isCookieBannerVisible={isCookieBannerVisual}
          />
      )}

      {/* Alert & Consent Container - Handled differently on mobile vs desktop */}
      <Suspense fallback={null}>
          {/* Desktop: Bottom Left Container for Social Alert */}
          {CONFIG.marketing.showSocialAlert && (
              <div className="hidden md:flex fixed bottom-6 left-6 z-[997] flex-col items-start gap-4">
                   <SocialFollowAlert show={isAlertVisible} onClose={handleCloseAlert} />
              </div>
          )}

          {/* Mobile & Desktop: Social Alert (Component handles its own positioning responsively) */}
          {CONFIG.marketing.showSocialAlert && (
              <div className="md:hidden">
                   <SocialFollowAlert show={isAlertVisible} onClose={handleCloseAlert} />
              </div>
          )}

          {/* Cookie Banner - Always fixed bottom */}
          {CONFIG.marketing.showCookieBanner && (
              <CookieConsent
                    show={showCookieBanner}
                    onAcceptAll={handleAcceptAll}
                    onAcceptNecessary={handleAcceptNecessary}
                    onOpenPreferences={handleOpenPreferences}
                    onVisibilityChange={setIsCookieBannerVisual}
              />
          )}
      </Suspense>

      {CONFIG.marketing.showCookieBanner && (
          <Suspense fallback={null}>
            <CookiePreferencesModal
                show={showPreferencesModal}
                onClose={handleClosePreferences}
                onSave={handleSavePreferences}
                initialState={consentState}
            />
          </Suspense>
      )}
    </div>
  );
};

export default App;
