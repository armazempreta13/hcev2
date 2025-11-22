
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export interface ConsentState {
    necessary: boolean; // Sempre true, usado para salvar a própria preferência
    analytics: boolean; // Google Analytics
    marketing: boolean; // Google Ads / Pixels (se houver no futuro)
    functional: boolean; // Chatbot history, preferências de UI salvas
}

export const CONSENT_KEY = 'hce_consent_v1';

export const defaultConsent: ConsentState = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
};

// Verifica se o usuário já tomou uma decisão
export const hasUserConsented = (): boolean => {
    try {
        return !!localStorage.getItem(CONSENT_KEY);
    } catch {
        return false;
    }
};

// Recupera o estado atual ou o padrão
export const getConsentState = (): ConsentState => {
    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return defaultConsent;
        return JSON.parse(stored);
    } catch {
        return defaultConsent;
    }
};

// Salva a decisão e atualiza o Google Analytics
export const saveConsentState = (state: ConsentState) => {
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('⚠️ Erro ao salvar preferências de cookies no localStorage:', e);
    }
    updateGtagConsent(state);
};

// Função interna para comunicar com o Google Tag Manager / GA4
export const updateGtagConsent = (state: ConsentState) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const consentMap = {
        'analytics_storage': state.analytics ? 'granted' : 'denied',
        'ad_storage': state.marketing ? 'granted' : 'denied',
        'ad_user_data': state.marketing ? 'granted' : 'denied',
        'ad_personalization': state.marketing ? 'granted' : 'denied',
        'personalization_storage': state.functional ? 'granted' : 'denied',
        'functionality_storage': state.functional ? 'granted' : 'denied',
        'security_storage': 'granted', // Sempre necessário
    };

    console.groupCollapsed('🔍 GTAG: Atualização de Consentimento');
    console.log('Estado:', state.analytics ? '✅ ACEITO' : '❌ RECUSADO');
    console.log('Detalhes:', consentMap);
    console.groupEnd();

    window.gtag('consent', 'update', consentMap);
    
    // Dispara evento para atualizar variáveis no GTM se necessário
    if (window.dataLayer) {
        window.dataLayer.push({ event: 'consent_update' });
    }
};
