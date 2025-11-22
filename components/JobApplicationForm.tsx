
import React, { useState, useEffect } from 'react';
import { CloseIcon, ArrowRightIcon, UserIcon, BriefcaseIcon, GraduationCapIcon, FileUploadIcon, CheckIcon } from './icons';
import { Tooltip } from './ui/Tooltip';
import { useFocusTrap } from './ui/hooks';

interface FormData {
    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    lastRole: string;
    company: string;
    experience: string;
    responsibilities: string;
    skills: string[];
    education: string;
    coverLetter: string;
    availability: string;
    hasCnh: string;
    constructionExperience: string;
    salaryExpectation: string;
    cvConfirmation: boolean;
}

interface JobApplicationFormProps {
    jobTitle: string;
    onClose: () => void;
    onApplicationEnd: () => void;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    lastRole: '',
    company: '',
    experience: '',
    responsibilities: '',
    skills: [],
    education: '',
    coverLetter: '',
    availability: '',
    hasCnh: '',
    constructionExperience: '',
    salaryExpectation: '',
    cvConfirmation: false,
};

// --- Dados Geográficos do Brasil ---
const brazilianStates = [
    { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' }
];

const citiesByState: { [key: string]: string[] } = {
    'AC': ['Rio Branco'], 'AL': ['Maceió'], 'AP': ['Macapá'], 'AM': ['Manaus'],
    'BA': ['Salvador', 'Feira de Santana'], 'CE': ['Fortaleza', 'Caucaia'], 
    'DF': ['Águas Claras', 'Brasília (Plano Piloto)', 'Ceilândia', 'Gama', 'Guará', 'Lago Norte', 'Lago Sul', 'Samambaia', 'Santa Maria', 'Sobradinho', 'Taguatinga'],
    'ES': ['Vitória', 'Vila Velha'], 'GO': ['Goiânia', 'Aparecida de Goiânia'], 'MA': ['São Luís'],
    'MT': ['Cuiabá'], 'MS': ['Campo Grande'], 'MG': ['Belo Horizonte', 'Uberlândia'],
    'PA': ['Belém'], 'PB': ['João Pessoa'], 'PR': ['Curitiba', 'Londrina'], 'PE': ['Recife', 'Jaboatão dos Guararapes'],
    'PI': ['Teresina'], 'RJ': ['Rio de Janeiro', 'São Gonçalo'], 'RN': ['Natal'],
    'RS': ['Porto Alegre', 'Caxias do Sul'], 'RO': ['Porto Velho'], 'RR': ['Boa Vista'],
    'SC': ['Florianópolis', 'Joinville'], 'SP': ['São Paulo', 'Guarulhos', 'Campinas'],
    'SE': ['Aracaju'], 'TO': ['Palmas']
};
// ------------------------------------

const allSkills = [
    'Montagem Linha Gold',
    'Montagem Linha Suprema',
    'Leitura de Projetos',
    'Instalação em Obras',
    'Manutenção de Esquadrias',
    'Operação de Máquinas',
    'Soldagem',
    'Trabalho em Equipe',
];

const stepsInfo = [
    { step: 1, label: 'Pessoal', icon: UserIcon },
    { step: 2, label: 'Experiência', icon: BriefcaseIcon },
    { step: 3, label: 'Qualificações', icon: GraduationCapIcon },
    { step: 4, label: 'Finalização', icon: FileUploadIcon },
];

const DetailedProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex items-start mb-8 sm:mb-10 -mx-2">
        {stepsInfo.map((item, index) => {
            const isCompleted = currentStep > item.step;
            const isActive = currentStep === item.step;
            const Icon = item.icon;

            return (
                <React.Fragment key={item.step}>
                    <div className="flex flex-col items-center text-center z-10 w-1/4 px-1">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                            isCompleted ? 'bg-accent border-accent text-primary' :
                            isActive ? 'bg-accent border-accent text-primary scale-110 shadow-lg shadow-accent/30' :
                            'bg-slate-700 border-slate-600 text-slate-400'
                        }`}>
                           {isCompleted ? <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </div>
                        <p className={`mt-2 text-[10px] sm:text-xs font-bold transition-colors duration-300 line-clamp-1 ${
                            isActive || isCompleted ? 'text-white' : 'text-slate-400'
                        }`}>{item.label}</p>
                    </div>
                    {index < stepsInfo.length - 1 && (
                        <div className="flex-1 h-1 bg-slate-600 mt-5">
                            <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: isCompleted ? '100%' : (isActive ? '50%' : '0%') }}></div>
                        </div>
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobTitle, onClose, onApplicationEnd }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const modalRef = useFocusTrap(true);
    const storageKey = `hceJobApplication_${jobTitle.replace(/\s+/g, '-')}`;

    // Load state from localStorage on mount
    useEffect(() => {
        try {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
                const { savedFormData, savedStep } = JSON.parse(savedState);
                if (savedFormData && savedStep) {
                    setFormData(savedFormData);
                    setStep(savedStep);
                }
            }
        } catch (error) {
            console.error("Failed to load application state from localStorage", error);
        }
    }, [storageKey]);

    // Save state to localStorage on change
    useEffect(() => {
        try {
            const stateToSave = JSON.stringify({ savedFormData: formData, savedStep: step });
            localStorage.setItem(storageKey, stateToSave);
        } catch (error) {
            console.error("Failed to save application state to localStorage", error);
        }
    }, [formData, step, storageKey]);

    const whatsappRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            let formattedValue = value;
            if (name === 'phone') {
                formattedValue = value
                    .replace(/\D/g, '')
                    .replace(/^(\d{2})(\d)/g, '($1) $2')
                    .replace(/(\d{4,5})(\d{4})/, '$1-$2')
                    .slice(0, 15);
            }
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        
        // Se o estado for alterado, resete a cidade
        if (name === 'state') {
            setFormData(prev => ({ ...prev, city: '' }));
        }

        if (errors[name as keyof FormData]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof FormData];
                return newErrors;
            });
        }
    };

    const handleSkillChange = (skill: string) => {
        setFormData(prev => {
            const newSkills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills: newSkills };
        });
    };

    const validateStep = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
            if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = 'E-mail inválido.';
            if (!formData.phone.trim() || !whatsappRegex.test(formData.phone)) newErrors.phone = 'Telefone inválido (XX) XXXXX-XXXX.';
            if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório.';
            if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória.';
        }
        if (step === 2) {
            if (!formData.lastRole.trim()) newErrors.lastRole = 'Cargo é obrigatório.';
            if (!formData.experience.trim()) newErrors.experience = 'Experiência é obrigatória.';
            if (!formData.constructionExperience.trim()) newErrors.constructionExperience = 'Informe se possui experiência em obras.';
        }
        if (step === 3) {
            if (!formData.education.trim()) newErrors.education = 'Formação é obrigatória.';
            if (!formData.availability.trim()) newErrors.availability = 'Disponibilidade é obrigatória.';
            if (!formData.hasCnh.trim()) newErrors.hasCnh = 'Informe se possui CNH.';
        }
        if (step === 4) {
            if (!formData.cvConfirmation) newErrors.cvConfirmation = 'Você deve confirmar o envio do currículo.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const handleReset = () => {
        if (window.confirm("Tem certeza que deseja apagar os dados preenchidos e recomeçar?")) {
            onApplicationEnd(); // This clears localStorage in parent and updates button
            setFormData(initialFormData);
            setStep(1);
            setErrors({});
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateStep()) return;
        
        setIsSubmitting(true);
        
        const message = `
*Candidatura para a vaga: ${jobTitle}*

*DADOS PESSOAIS*
- *Nome:* ${formData.name}
- *Email:* ${formData.email}
- *Telefone:* ${formData.phone}
- *Cidade/Estado:* ${formData.city} / ${formData.state}

*QUALIFICAÇÕES*
- *Possui CNH:* ${formData.hasCnh}
- *Disponibilidade:* ${formData.availability}
- *Experiência em Obras:* ${formData.constructionExperience}
- *Formação:* ${formData.education}
- *Habilidades:* ${formData.skills.length > 0 ? formData.skills.join(', ') : 'Nenhuma informada'}

*EXPERIÊNCIA PROFISSIONAL*
- *Último Cargo:* ${formData.lastRole}
- *Empresa:* ${formData.company || 'Não informado'}
- *Tempo de Experiência:* ${formData.experience}
- *Principais Atividades:*
${formData.responsibilities || 'Não informado'}

*INFORMAÇÕES ADICIONAIS*
- *Pretensão Salarial:* ${formData.salaryExpectation || 'A combinar'}
- *Carta de Apresentação:*
${formData.coverLetter || 'Não informado'}

---
*IMPORTANTE:*
Lembre-se de *ANEXAR* seu currículo aqui na conversa para validar sua candidatura.
        `.trim().replace(/^\s+/gm, '');

        const phoneNumber = '5561993619554';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            setIsSubmitting(false);
            onApplicationEnd(); // Clean up storage and notify parent
            onClose();
        }, 1000);
    };
    
    // Use text-base (16px) for inputs on mobile to prevent iOS zoom
    const getInputClass = (field: keyof FormData) => `w-full bg-slate-800 border-2 ${errors[field] ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg p-4 sm:p-3 text-base transition-colors focus:border-accent focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed appearance-none`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 animate-fadeInUp" style={{animationDuration: '0.3s'}} onClick={onClose}>
            <div ref={modalRef} className="bg-primary rounded-none sm:rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 sm:p-6 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">Candidatura para:</h2>
                        <p className="text-accent font-semibold text-sm sm:text-base line-clamp-1">{jobTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 -mr-2">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </header>
                
                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-grow">
                    <DetailedProgressBar currentStep={step} />
                    
                    <div className="relative min-h-[300px] sm:min-h-[380px]">
                        <div key={step}>
                            {step === 1 && (
                                <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
                                    <div className="flex items-center gap-3 text-white text-lg font-semibold"><UserIcon/> <h3>Informações Pessoais</h3></div>
                                    <div>
                                        <input type="text" name="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange} className={getInputClass('name')} />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <input type="email" name="email" placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <input type="tel" name="phone" placeholder="WhatsApp (XX) XXXXX-XXXX" value={formData.phone} onChange={handleChange} className={getInputClass('phone')} />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <select name="state" value={formData.state} onChange={handleChange} className={getInputClass('state')}>
                                                <option value="" disabled>Selecione o Estado</option>
                                                {brazilianStates.map(s => <option key={s.uf} value={s.uf}>{s.name}</option>)}
                                            </select>
                                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                        </div>
                                        <div>
                                            <select name="city" value={formData.city} onChange={handleChange} className={getInputClass('city')} disabled={!formData.state}>
                                                <option value="" disabled>Selecione a Cidade</option>
                                                {formData.state && citiesByState[formData.state]?.sort().map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
                                    <div className="flex items-center gap-3 text-white text-lg font-semibold"><BriefcaseIcon/> <h3>Experiência Profissional</h3></div>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <input type="text" name="lastRole" placeholder="Último Cargo Ocupado" value={formData.lastRole} onChange={handleChange} className={getInputClass('lastRole')} />
                                            {errors.lastRole && <p className="text-red-500 text-sm mt-1">{errors.lastRole}</p>}
                                        </div>
                                        <div>
                                            <input type="text" name="company" placeholder="Última Empresa (Opcional)" value={formData.company} onChange={handleChange} className={getInputClass('company')} />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <select name="experience" value={formData.experience} onChange={handleChange} className={getInputClass('experience')}>
                                                <option value="">Tempo de Experiência na Área</option>
                                                <option value="Não tenho experiência">Não tenho experiência</option>
                                                <option value="Menos de 1 ano">Menos de 1 ano</option>
                                                <option value="1 a 3 anos">1 a 3 anos</option>
                                                <option value="3 a 5 anos">3 a 5 anos</option>
                                                <option value="Mais de 5 anos">Mais de 5 anos</option>
                                            </select>
                                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                        </div>
                                        <div>
                                            <select name="constructionExperience" value={formData.constructionExperience} onChange={handleChange} className={getInputClass('constructionExperience')}>
                                                <option value="">Já trabalhou em obras?</option>
                                                <option value="Sim">Sim</option>
                                                <option value="Não">Não</option>
                                            </select>
                                            {errors.constructionExperience && <p className="text-red-500 text-sm mt-1">{errors.constructionExperience}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <textarea name="responsibilities" placeholder="Descreva suas principais responsabilidades (Opcional)" value={formData.responsibilities} onChange={handleChange} rows={4} className={getInputClass('responsibilities')}></textarea>
                                    </div>
                                </div>
                            )}
                            
                            {step === 3 && (
                                <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
                                    <div className="flex items-center gap-3 text-white text-lg font-semibold"><GraduationCapIcon/> <h3>Habilidades e Qualificações</h3></div>
                                    <div>
                                        <label className="text-slate-300 mb-2 block">Selecione suas principais habilidades:</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {allSkills.map(skill => (
                                                <button 
                                                    key={skill} 
                                                    type="button" 
                                                    onClick={() => handleSkillChange(skill)} 
                                                    className={`p-3 rounded-lg text-sm transition-all duration-200 ease-in-out flex items-center justify-between text-left ${
                                                        formData.skills.includes(skill) 
                                                            ? 'bg-accent text-primary font-bold scale-105 shadow-md' 
                                                            : 'bg-slate-700 text-white hover:bg-slate-600 transform active:scale-95'
                                                    }`}
                                                >
                                                    <span>{skill}</span>
                                                    {formData.skills.includes(skill) && <CheckIcon className="w-4 h-4 text-primary ml-2 flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <select name="education" value={formData.education} onChange={handleChange} className={getInputClass('education')}>
                                                <option value="">Nível de Formação</option>
                                                <option value="Ensino Fundamental">Ensino Fundamental</option>
                                                <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                                                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                                <option value="Ensino Técnico">Ensino Técnico</option>
                                                <option value="Ensino Superior (Cursando ou Completo)">Ensino Superior (Cursando ou Completo)</option>
                                            </select>
                                            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                                        </div>
                                        <div>
                                            <select name="hasCnh" value={formData.hasCnh} onChange={handleChange} className={getInputClass('hasCnh')}>
                                                <option value="">Possui CNH?</option>
                                                <option value="Sim, categoria A">Sim, categoria A</option>
                                                <option value="Sim, categoria B">Sim, categoria B</option>
                                                <option value="Sim, categorias A e B">Sim, categorias A e B</option>
                                                <option value="Sim, outras categorias">Sim, outras categorias</option>
                                                <option value="Não possuo CNH">Não possuo CNH</option>
                                            </select>
                                            {errors.hasCnh && <p className="text-red-500 text-sm mt-1">{errors.hasCnh}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <select name="availability" value={formData.availability} onChange={handleChange} className={getInputClass('availability')}>
                                            <option value="">Disponibilidade para Início</option>
                                            <option value="Imediata">Imediata</option>
                                            <option value="Em até 7 dias">Em até 7 dias</option>
                                            <option value="Em até 15 dias">Em até 15 dias</option>
                                            <option value="A negociar">A negociar</option>
                                        </select>
                                        {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                                    </div>
                                </div>
                            )}
                            
                            {step === 4 && (
                                <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
                                    <div className="flex items-center gap-3 text-white text-lg font-semibold"><FileUploadIcon/> <h3>Finalização</h3></div>
                                    <div>
                                        <input type="text" name="salaryExpectation" placeholder="Pretensão Salarial (Opcional)" value={formData.salaryExpectation} onChange={handleChange} className={getInputClass('salaryExpectation')} />
                                    </div>
                                    <div>
                                        <textarea name="coverLetter" placeholder="Algo mais que queira nos contar? (Opcional)" value={formData.coverLetter} onChange={handleChange} rows={4} className={getInputClass('coverLetter')}></textarea>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-lg">
                                        <label htmlFor="cvConfirmation" className="flex items-start gap-3 cursor-pointer">
                                            <input id="cvConfirmation" type="checkbox" name="cvConfirmation" checked={formData.cvConfirmation} onChange={handleChange} className="mt-1 h-6 w-6 rounded border-gray-300 text-accent focus:ring-accent" />
                                            <div>
                                                <span className="text-white font-semibold">
                                                    Atenção: Envio do Currículo
                                                    <Tooltip content="É necessário enviar o CV pelo WhatsApp para a candidatura ser válida.">
                                                        <span className="inline-block text-accent cursor-help ml-1">(?)</span>
                                                    </Tooltip>
                                                </span>
                                                <p className="text-slate-300 text-sm">Após finalizar, você será redirecionado para o WhatsApp. Para que sua candidatura seja válida, anexe seu currículo na conversa.</p>
                                            </div>
                                        </label>
                                        {errors.cvConfirmation && <p className="text-red-500 text-sm mt-2">{errors.cvConfirmation}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="p-4 sm:p-6 flex justify-between items-center border-t border-slate-700 flex-shrink-0 bg-primary pb-safe">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={prevStep} className={`px-4 py-3 sm:py-2 font-bold text-slate-400 transition-all duration-300 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-white'}`}>
                            Voltar
                        </button>
                        {step > 1 && (
                            <button type="button" onClick={handleReset} className="hidden sm:block font-bold text-slate-500 text-xs hover:text-red-400 transition-colors">
                                Recomeçar
                            </button>
                        )}
                    </div>
                    
                    {step < 4 ? (
                        <button type="button" onClick={nextStep} className="inline-flex items-center bg-accent text-primary font-bold font-poppins text-base uppercase px-8 py-4 sm:py-3.5 rounded-full transition-all duration-300 ease-in-out active:scale-95 hover:scale-105 shimmer-effect">
                            Avançar <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </button>
                    ) : (
                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting || !formData.cvConfirmation} className="inline-flex items-center justify-center bg-accent text-primary font-bold font-poppins text-base uppercase px-8 py-4 sm:py-3.5 rounded-full transition-all duration-300 ease-in-out active:scale-95 hover:scale-105 shimmer-effect disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto min-w-[200px]">
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Finalizar no WhatsApp'}
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default JobApplicationForm;
