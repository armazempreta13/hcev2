
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon, ChatBubbleOvalLeftEllipsisIcon, PaperPlaneIcon, RefreshIcon, PaperClipIcon } from './icons';
import { getIconComponent } from './ui/IconMap';
import { calculateEstimate } from './utils/pricingEstimator';
import { FaSun, FaMoon } from 'react-icons/fa';
import { getConsentState } from './utils/consent';

// ==================== TYPES ====================
type NodeId = string;
interface Option { text: string; nextNode: NodeId; icon?: string }
interface Node {
    type: 'questionWithOptions' | 'questionWithInput' | 'message' | 'messageWithLink' | 'internalRedirect' | 'externalRedirect' | 'calculation';
    botMessages: string[];
    options?: Option[];
    requestsFileUpload?: boolean;
    nextStateKey?: string;
    nextNode?: NodeId;
    link?: string;
    linkText?: string;
    external?: boolean;
    icon?: string;
    whatsappTemplate?: string;
}
interface Msg {
    id: number;
    sender: 'bot' | 'user';
    text?: string;
    options?: Option[];
    link?: { text: string; url: string; external?: boolean; icon?: string };
    ts: string;
}
interface State {
    msgs: Msg[];
    nodeId: NodeId;
    data: Record<string, any>;
    hist: NodeId[];
    ctx: {
        clickCounts?: Record<NodeId, number>;
        [key: string]: any;
    };
}

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    isCookieBannerVisible?: boolean;
}

// ==================== CONFIG ====================
const C = {
    KEY: 'hceChatState',
    KEY_WELCOMED: 'hceChatWelcomed',
    MAX: 100,
    DELAY: 600,
    TYPE: 300,
    SIZE: 10485760,
    TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    WA_NUM: '5561993619554'
};

// ==================== UTILS ====================
const U = {
    ts: () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    
    store: {
        // ONLY SAVE IF FUNCTIONAL COOKIES ARE ALLOWED
        save: (s: State) => {
            try {
                const consent = getConsentState();
                if (!consent.functional) return;
                
                localStorage.setItem(C.KEY, JSON.stringify({ ...s, msgs: s.msgs.slice(-C.MAX) }));
            } catch { localStorage.removeItem(C.KEY); }
        },
        // LOAD ONLY IF ALLOWED
        load: (): State | null => {
            try {
                const consent = getConsentState();
                if (!consent.functional) return null;

                const d = localStorage.getItem(C.KEY);
                if (!d) return null;
                const parsed = JSON.parse(d);
                return { 
                    ...parsed, 
                    hist: parsed.hist || [], 
                    ctx: parsed.ctx || {} 
                };
            } catch { 
                localStorage.removeItem(C.KEY);
                return null;
            }
        },
        clear: () => {
             try {
                localStorage.removeItem(C.KEY);
            } catch {
                // Fails silently
            }
        }
    },
    
    file: (f: File) => f.size > C.SIZE ? 'Arquivo > 10MB' : !C.TYPES.includes(f.type) ? 'Tipo inválido' : null,
    
    interp: (t: string, d: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => d[k] || ''),
    
    wa: (n: string, i: string) => `https://wa.me/${C.WA_NUM}?text=${encodeURIComponent(`Olá! Meu nome é ${n} e gostaria de falar sobre: ${i}`)}`,
    
    db: <T extends (...a: any[]) => any>(f: T, ms: number) => {
        let t: number;
        return (...a: Parameters<T>) => {
            clearTimeout(t);
            t = window.setTimeout(() => f(...a), ms);
        };
    },

    parseSimpleMarkdown: (text: string): string => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\n/g, '<br />'); // Newlines
    },

    formatCurrency: (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
};

// ==================== TYPING INDICATOR ====================
const Typing = memo(() => (
    <div className="flex items-center space-x-1.5 p-4 animate-chat-fade-in-up self-start">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing-dot" />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing-dot" style={{ animationDelay: `0.2s` }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing-dot" style={{ animationDelay: `0.4s` }} />
    </div>
));

// ==================== MESSAGE ITEM ====================
const MsgItem = memo(({ m, onOpt }: { m: Msg; onOpt: (o: Option) => void }) => (
    <div className={`flex flex-col animate-chat-fade-in-up w-full ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
        {m.sender === 'bot' ? (
            <div className="flex flex-col items-start gap-2.5 max-w-[90%] sm:max-w-[85%]">
                {m.text && (
                    <div className="bg-white p-4 rounded-2xl rounded-bl-lg border border-slate-200 shadow-sm bot-bubble">
                        <p className="text-slate-800 text-sm leading-relaxed bot-text" dangerouslySetInnerHTML={{ __html: U.parseSimpleMarkdown(m.text) }} />
                    </div>
                )}
                {m.options && (
                    <div className="grid gap-2 pt-1 w-full">
                        {m.options.map((o, i) => {
                            const Icon = getIconComponent(o.icon);
                            return (
                                <button 
                                    key={i}
                                    onClick={() => onOpt(o)}
                                    className="group flex items-center w-full text-left bg-white border border-slate-300 text-primary hover:border-primary font-semibold text-sm px-5 py-4 sm:py-3.5 rounded-xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 chat-option active:scale-98"
                                >
                                    {Icon && <Icon className="w-5 h-5 mr-3 text-primary/80 group-hover:text-primary transition-colors chat-option-icon" />}
                                    <span className="flex-1 chat-option-text">{o.text}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {m.link && (
                    <div className="pt-1 w-full">
                        <a 
                            href={m.link.url}
                            target={m.link.external ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center w-full bg-white border border-slate-300 text-primary hover:border-primary font-semibold text-sm px-5 py-4 sm:py-3.5 rounded-xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 chat-option active:scale-98"
                        >
                            {(() => {
                                const Icon = getIconComponent(m.link.icon);
                                return Icon ? <Icon className="w-5 h-5 mr-3 text-primary/80 group-hover:text-primary transition-colors chat-option-icon" /> : null;
                            })()}
                            <span className="chat-option-text">{m.link.text}</span>
                        </a>
                    </div>
                )}
            </div>
        ) : (
            <div className="bg-primary text-white p-4 rounded-2xl rounded-br-lg shadow-md max-w-[85%] user-bubble">
                <p className="text-sm leading-relaxed user-text">{m.text}</p>
            </div>
        )}
    </div>
), (p, n) => p.m.id === n.m.id);

// ==================== MAIN ====================
const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, isCookieBannerVisible }) => {
    const [typing, setTyping] = useState(false);
    const [inp, setInp] = useState('');
    const [tree, setTree] = useState<Record<NodeId, Node> | null>(null);
    const [st, setSt] = useState<State>({
        msgs: [],
        nodeId: 'start',
        data: {},
        hist: [],
        ctx: {}
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            // Check functional consent before reading preferences
            const consent = getConsentState();
            if (consent.functional) {
                return localStorage.getItem('hceChatDarkMode') === 'true';
            }
            return false;
        } catch {
            return false;
        }
    });
    
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<number[]>([]);
    const isInitialized = useRef(false);
    const prevNodeId = useRef(st.nodeId);
    const nav = useNavigate();

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    // Lock body scroll on mobile when chat is open
    useEffect(() => {
        const manageBodyScroll = () => {
            // Tailwind 'sm' breakpoint is 640px.
            // We assume 'mobile' is < 640px where the chat acts as a bottom sheet.
            const isMobile = window.innerWidth < 640;
            
            if (isOpen && isMobile) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        // Run initially
        manageBodyScroll();

        // Run on resize (e.g. orientation change)
        window.addEventListener('resize', manageBodyScroll);

        // Cleanup
        return () => {
            window.removeEventListener('resize', manageBodyScroll);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        try {
             // Only save preferences if functional consent is granted
            const consent = getConsentState();
            if (consent.functional) {
                localStorage.setItem('hceChatDarkMode', String(isDarkMode));
            }
        } catch (e) {
            console.warn('Could not save dark mode preference.');
        }
    }, [isDarkMode]);

    useEffect(() => () => clearTimers(), [clearTimers]);

    useEffect(() => {
        fetch('/chatbot-data.json')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setTree(data))
            .catch(() => {
                console.warn("Could not fetch chatbot-data.json, falling back to static import.");
                import('../chatbot-data.json').then(mod => setTree(mod.default));
            });
    }, []);

    const addM = useCallback((m: Omit<Msg, 'id' | 'ts'>) => {
        setSt(p => ({
            ...p,
            msgs: [...p.msgs, { ...m, id: Date.now() + Math.random(), ts: U.ts() }]
        }));
    }, []);

    const proc = useCallback((nid: NodeId, state: State) => {
        if (!tree) return;
        
        const n = tree[nid];
        if (!n) {
            console.error(`Node ${nid} not found`);
            return;
        }

        if (nid === 'start') {
            try {
                 const consent = getConsentState();
                 if (consent.functional) {
                    localStorage.setItem(C.KEY_WELCOMED, 'true');
                 }
            } catch (e) {
                console.warn('Could not set hceChatWelcomed flag in localStorage.');
            }
        }
        
        // Special calculation node
        if (n.type === 'calculation' && n.nextNode) {
            const { quoteService, quoteArea, quoteQuality } = state.data;
            const estimate = calculateEstimate(quoteService, Number(quoteArea), quoteQuality);
            const newData = { ...state.data };

            if(estimate) {
                newData.estimateTotal = U.formatCurrency(estimate.total);
                newData.estimateMaterials = U.formatCurrency(estimate.materialCost);
                newData.estimateLabor = U.formatCurrency(estimate.laborCost);
                newData.estimateDays = `${estimate.estimatedDays} dias úteis`;
            }

            setSt(p => ({ ...p, data: newData, nodeId: n.nextNode! }));
            return;
        }


        clearTimers();
        setTyping(true);

        const show = (i = 0) => {
            if (i >= n.botMessages.length) {
                const t = window.setTimeout(() => {
                    setTyping(false);
                    
                    if (n.type === 'questionWithInput') return;
                    
                    if (n.type === 'internalRedirect' && n.link && n.nextNode) {
                        setTimeout(() => nav(n.link!), 800);
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                    } else if (n.type === 'messageWithLink' && n.nextNode) {
                        let finalUrl = '#';
                        if (n.whatsappTemplate) {
                            const interpolatedMessage = U.interp(n.whatsappTemplate, state.data);
                            finalUrl = `https://wa.me/${C.WA_NUM}?text=${encodeURIComponent(interpolatedMessage)}`;
                        } else {
                            finalUrl = U.wa(state.data.userName || '', state.data.projectInfo || '');
                        }

                        addM({ 
                            sender: 'bot', 
                            link: { 
                                text: n.linkText!, 
                                url: finalUrl,
                                external: n.external, 
                                icon: n.icon 
                            }
                        });
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                    } else if (n.options?.length) {
                        const clickCounts = state.ctx.clickCounts || {};
                        const sortedOptions = [...n.options].sort((a, b) => 
                            (clickCounts[b.nextNode] || 0) - (clickCounts[a.nextNode] || 0)
                        );
                        addM({ sender: 'bot', options: sortedOptions });
                    } else if (n.nextNode) {
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                    }
                }, C.TYPE);
                timerRef.current.push(t);
                return;
            }
            
            const t = window.setTimeout(() => {
                addM({ sender: 'bot', text: U.interp(n.botMessages[i], state.data) });
                show(i + 1);
            }, C.DELAY);
            timerRef.current.push(t);
        };

        const t = window.setTimeout(() => show(), C.TYPE);
        timerRef.current.push(t);
    }, [tree, addM, clearTimers, nav]);

     useEffect(() => {
        if (!tree) return;

        // Initialization logic: runs only once.
        if (!isInitialized.current) {
            isInitialized.current = true;
            const saved = U.store.load();
            if (saved && saved.msgs.length > 0) {
                setSt(saved);
                prevNodeId.current = saved.nodeId;
                return; // State loaded, exit to prevent running proc immediately.
            } else {
                const hasBeenWelcomed = localStorage.getItem(C.KEY_WELCOMED) === 'true';
                const startNodeId = hasBeenWelcomed ? 'main_menu_return' : 'start';
                const initialState = { ...st, nodeId: startNodeId };
                setSt(initialState);
                prevNodeId.current = startNodeId;
                proc(startNodeId, initialState); // Kick off the new conversation.
                return;
            }
        }

        // Progression logic: runs when nodeId changes.
        if (st.nodeId !== prevNodeId.current) {
            proc(st.nodeId, st);
            prevNodeId.current = st.nodeId;
        }
    }, [tree, st.nodeId, st.data, proc]); // Dependencies ensure this runs on state changes.
    
    useEffect(() => {
        if (st.msgs.length > 0) U.db(() => U.store.save(st), 500)();
    }, [st]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            requestAnimationFrame(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            });
        }
    }, [st.msgs, typing]);

    const handleOpt = useCallback((o: Option) => {
        addM({ sender: 'user', text: o.text });
        setSt(p => {
            const newClickCounts = { ...(p.ctx.clickCounts || {}) };
            newClickCounts[o.nextNode] = (newClickCounts[o.nextNode] || 0) + 1;

            const currentNode = tree?.[p.nodeId];
            const newData = { ...p.data };
            if (currentNode?.nextStateKey) {
                const valueMap: Record<string, string> = {
                    // Quote Service
                    'Janelas, Portas e Esquadrias': 'windows_doors',
                    'Fachadas e Pele de Vidro': 'facades',
                    'Guarda-Corpos e Corrimãos': 'railings',
                    'Ripados e Brises': 'brises',
                    // Quote Quality
                    'Padrão': 'standard',
                    'Sofisticado': 'premium',
                    'Luxo': 'luxury',
                    // Support Type
                    'Solicitar Manutenção': 'Manutenção Corretiva',
                    'Problema na Instalação': 'Verificação de Instalação',
                    // Specialist Stage
                    'Estou apenas pesquisando ideias': 'Pesquisando ideias',
                    'Já tenho um projeto de arquitetura': 'Com projeto de arquitetura',
                    'A obra já está em andamento': 'Obra em andamento',
                };
                const optionTextWithoutEmoji = o.text.trim();
                newData[currentNode.nextStateKey] = valueMap[optionTextWithoutEmoji] || optionTextWithoutEmoji;
            }

            return {
                ...p,
                msgs: p.msgs.map(m => ({ ...m, options: undefined })),
                hist: [...p.hist, p.nodeId],
                nodeId: o.nextNode,
                data: newData,
                ctx: { ...p.ctx, clickCounts: newClickCounts }
            };
        });
    }, [addM, tree]);

    const handleSub = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const v = inp.trim();
        if (!v || !tree) return;

        const n = tree[st.nodeId];
        if (!n?.nextNode || !n?.nextStateKey) return;

        addM({ sender: 'user', text: v });
        
        setSt(p => {
            const newD = { ...p.data, [n.nextStateKey!]: v };
            const newCtx = { ...p.ctx };
            
            if (n.nextStateKey === 'userName') newCtx.userName = v;
            if (n.nextStateKey === 'projectInfo') newCtx.projectType = v;
            
            return { 
                ...p, 
                nodeId: n.nextNode!, 
                data: newD, 
                hist: [...p.hist, p.nodeId],
                ctx: newCtx
            };
        });
        setInp('');
    }, [inp, tree, addM, st.nodeId]);

    const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || !tree) return;

        const err = U.file(f);
        if (err) {
            alert(err);
            e.target.value = '';
            return;
        }

        const n = tree[st.nodeId];
        if (!n?.nextNode) return;

        addM({ sender: 'user', text: `📎 ${f.name}` });

        setSt(p => {
            const newD = { ...p.data, file: f.name };
            return { 
                ...p, 
                nodeId: n.nextNode!, 
                data: newD, 
                hist: [...p.hist, p.nodeId] 
            };
        });
        e.target.value = '';
    }, [tree, addM, st.nodeId]);

    const reset = useCallback(() => {
        clearTimers();
        setTyping(false);
        setInp('');
        U.store.clear();
        isInitialized.current = false;
        try {
             localStorage.removeItem(C.KEY_WELCOMED);
        } catch (e) {
            console.warn('Could not remove hceChatWelcomed flag from localStorage.');
        }
        
        const initialState = { msgs: [], nodeId: 'start', data: {}, hist: [], ctx: {} };
        setSt(initialState);
        prevNodeId.current = 'start';
        proc('start', initialState);
    }, [clearTimers, proc]);

    useEffect(() => {
        if (!isOpen) return;
        const handle = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [isOpen, onClose]);

    const node = useMemo(() => tree?.[st.nodeId] ?? null, [tree, st.nodeId]);
    const showInp = !typing && node?.type === 'questionWithInput';

    useEffect(() => {
        if (showInp) {
            const timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [showInp]);

    return (
        <>
            <div
                className={`
                    fixed z-[1000] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white shadow-2xl shadow-primary/20 border border-slate-200/80
                    ${isDarkMode ? 'dark-chat' : ''}
                    
                    /* Mobile Styles (Bottom Sheet Mode) */
                    bottom-0 left-0 w-full h-[85vh] rounded-t-3xl rounded-b-none
                    
                    /* Desktop Styles (Floating Widget Mode) */
                    sm:h-auto sm:left-auto sm:right-6 sm:w-[400px] sm:rounded-3xl sm:origin-bottom-right
                    
                    ${isOpen 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0 pointer-events-none'
                    }
                    
                    /* Dynamic bottom spacing for desktop based on cookie banner */
                    ${isCookieBannerVisible ? 'sm:bottom-[200px]' : 'sm:bottom-28'}
                `}
                style={window.innerWidth >= 640 ? { height: 'clamp(500px, 85vh, 700px)' } : {}}
                aria-hidden={!isOpen}
            >
                <header className="bg-white p-4 sm:p-5 rounded-t-3xl flex items-center justify-between text-white flex-shrink-0 border-b border-slate-200 chatbot-header cursor-pointer sm:cursor-default" onClick={() => window.innerWidth < 640 && onClose()}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <img src="https://i.imgur.com/spMimAM.png" alt="HCE" className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-heading chatbot-header-title">Ester</h3>
                            <p className="text-xs text-body chatbot-header-subtitle">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); }}
                            className="p-3 sm:p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors chatbot-header-button"
                            aria-label={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
                        >
                            {isDarkMode ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClose(); }} 
                            className="p-3 sm:p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors chatbot-header-button" 
                            aria-label="Fechar chat"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto bg-slate-50 chatbot-scrollbar flex flex-col chatbot-messages" aria-live="polite" aria-atomic="false">
                    {st.msgs.map(m => <MsgItem key={m.id} m={m} onOpt={handleOpt} />)}
                    {typing && <Typing />}
                </div>

                <footer className="p-4 sm:p-5 mt-auto border-t border-slate-200 bg-white sm:rounded-b-3xl chatbot-footer pb-safe">
                    {showInp ? (
                        <form onSubmit={handleSub} className="flex items-center gap-2 chatbot-input-form">
                            {node?.requestsFileUpload && (
                                <>
                                    <button 
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="w-12 h-12 sm:w-11 sm:h-11 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-slate-200"
                                        aria-label="Anexar arquivo"
                                    >
                                        <PaperClipIcon className="w-5 h-5" />
                                    </button>
                                    <input ref={fileRef} type="file" onChange={handleFile} accept={C.TYPES.join(',')} className="hidden" />
                                </>
                            )}
                             <button 
                                type="button"
                                onClick={reset}
                                className="w-12 h-12 sm:w-11 sm:h-11 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-slate-200"
                                aria-label="Reiniciar conversa"
                            >
                                <RefreshIcon className="w-5 h-5" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inp}
                                onChange={e => setInp(e.target.value)}
                                placeholder="Digite sua resposta..."
                                className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-slate-300 focus:ring-0 rounded-full px-5 py-4 sm:py-3 text-base transition-all text-slate-800 placeholder:text-slate-500 chatbot-input"
                                aria-label="Campo de entrada de texto"
                            />
                            <button 
                                type="submit"
                                className="w-12 h-12 sm:w-11 sm:h-11 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-heading hover:scale-110 disabled:bg-slate-300 disabled:scale-100 chatbot-send-button"
                                disabled={!inp.trim()}
                                aria-label="Enviar mensagem"
                            >
                                <PaperPlaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <div className="text-center text-xs text-slate-400 py-3 chatbot-placeholder-text">Selecione uma opção acima</div>
                    )}
                </footer>
            </div>
        </>
    );
};

export default Chatbot;
