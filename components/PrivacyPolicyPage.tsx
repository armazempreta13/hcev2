import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal, KineticText } from './ui/Animations';
import { MailIcon, WhatsAppIcon, InstagramIcon, ArrowRightIcon } from './icons';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';

const PrivacyPolicyPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Política de Privacidade | HCE Esquadrias';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Consulte nossa Política de Privacidade para entender como a HCE Esquadrias coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.');
    }, []);

    const addToRefs = useScrollReveal();

    const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <h2 ref={addToRefs} className="font-armstrong text-2xl md:text-3xl uppercase text-heading tracking-tight mt-12 mb-6 scroll-reveal">
            <KineticText text={String(children)} />
        </h2>
    );

    const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <p ref={addToRefs} className="text-body/90 text-lg leading-relaxed mb-4 scroll-reveal">
            {children}
        </p>
    );

    const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <li ref={addToRefs} className="text-body/90 text-lg leading-relaxed ml-6 mb-2 list-disc scroll-reveal">
            {children}
        </li>
    );

    return (
        <div className="bg-white">
            <header className="bg-soft-gray pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text="Política de Privacidade" />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        Seu conforto e segurança são nossa prioridade, tanto em nossos produtos quanto no tratamento dos seus dados.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-4xl">
                <section>
                    <Paragraph>
                        A <strong>HCE Esquadrias</strong>, pessoa jurídica de direito privado inscrita no CNPJ sob o nº 10.987.654/0001-32, com sede em Brasília - DF, leva a sua privacidade a sério e zela pela segurança e proteção de dados de todos os seus clientes, parceiros, fornecedores e usuários do site.
                    </Paragraph>
                    <Paragraph>
                        Esta Política de Privacidade destina-se a informá-lo sobre o modo como nós utilizamos e divulgamos informações coletadas em suas visitas ao nosso site e em mensagens que trocamos com você. Esta Política de Privacidade aplica-se somente a informações coletadas por meio do site.
                    </Paragraph>
                    <Paragraph>
                        <strong>AO ACESSAR O SITE, ENVIAR COMUNICAÇÕES OU FORNECER QUALQUER TIPO DE DADO PESSOAL, VOCÊ DECLARA ESTAR CIENTE E DE ACORDO COM ESTA POLÍTICA DE PRIVACIDADE.</strong>
                    </Paragraph>

                    <SectionTitle>1. Dados que Coletamos</SectionTitle>
                    <Paragraph>
                        Coletamos os seguintes tipos de informações:
                    </Paragraph>
                    <ul>
                        <ListItem>
                            <strong>Dados de Contato:</strong> Nome, telefone e e-mail que você fornece ao preencher formulários de contato ou orçamento.
                        </ListItem>
                        <ListItem>
                            <strong>Informações do Projeto:</strong> Detalhes sobre seu projeto que você nos fornece voluntariamente para a elaboração de orçamentos, como tipo de obra, serviços de interesse e outras especificações.
                        </ListItem>
                        <ListItem>
                            <strong>Dados de Navegação:</strong> Informações sobre suas visitas e atividades, incluindo o conteúdo que você visualiza e utiliza, informações sobre o navegador e o dispositivo que você está usando, seu endereço IP, sua localização, o endereço do site a partir do qual você chegou.
                        </ListItem>
                    </ul>

                    <SectionTitle>2. Como Usamos Seus Dados</SectionTitle>
                    <Paragraph>
                        Utilizamos as informações coletadas para as seguintes finalidades:
                    </Paragraph>
                    <ul>
                        <ListItem>
                            <strong>Para fornecer nossos serviços:</strong> Responder às suas solicitações de orçamento e contato, agendar visitas técnicas e dar andamento às suas solicitações.
                        </ListItem>
                        <ListItem>
                            <strong>Para comunicação:</strong> Enviar comunicações sobre o andamento do seu projeto, responder a perguntas e fornecer suporte.
                        </ListItem>
                        <ListItem>
                            <strong>Para melhorar nosso site:</strong> Entender como nossos usuários interagem com o site para melhorar a usabilidade e a relevância do nosso conteúdo.
                        </ListItem>
                    </ul>
                    
                    <SectionTitle>3. Com Quem Compartilhamos os Dados</SectionTitle>
                    <Paragraph>
                        A HCE Esquadrias <strong>não compartilha, vende, aluga ou divulga</strong> seus dados pessoais com terceiros para fins de marketing. O compartilhamento de dados poderá ocorrer, estritamente, com prestadores de serviços e parceiros essenciais para a execução do seu projeto (como transportadoras ou equipes de instalação), sempre sob confidencialidade e para a finalidade contratada.
                    </Paragraph>

                    <SectionTitle>4. Segurança dos Seus Dados</SectionTitle>
                    <Paragraph>
                        Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra perda, uso não autorizado ou outros abusos. Os dados são armazenados em um ambiente operacional seguro que não é acessível ao público.
                    </Paragraph>

                    <SectionTitle>5. Tempo de Armazenamento</SectionTitle>
                    <Paragraph>
                        Armazenaremos seus dados pessoais pelo tempo necessário para cumprir com as finalidades para as quais os coletamos, inclusive para fins de cumprimento de quaisquer obrigações legais, contratuais, ou requisição de autoridades competentes.
                    </Paragraph>
                    
                    <SectionTitle>6. Seus Direitos (LGPD)</SectionTitle>
                    <Paragraph>
                        Você, como titular dos dados, tem o direito de solicitar a qualquer momento:
                    </Paragraph>
                     <ul>
                        <ListItem>
                            A confirmação da existência de tratamento dos seus dados.
                        </ListItem>
                        <ListItem>
                           O acesso aos seus dados.
                        </ListItem>
                        <ListItem>
                            A correção de dados incompletos, inexatos ou desatualizados.
                        </ListItem>
                        <ListItem>
                            A anonimização, bloqueio ou eliminação de dados desnecessários.
                        </ListItem>
                        <ListItem>
                            A eliminação dos dados tratados com seu consentimento.
                        </ListItem>
                        <ListItem>
                           Informações sobre o compartilhamento dos seus dados.
                        </ListItem>
                    </ul>
                     <Paragraph>
                        Para exercer seus direitos, entre em contato conosco pelo e-mail listado ao final desta política.
                    </Paragraph>

                    <SectionTitle>7. Alterações a Esta Política de Privacidade</SectionTitle>
                    <Paragraph>
                        Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise esta página de tempos em tempos para se manter informado sobre como estamos protegendo suas informações.
                    </Paragraph>
                    
                    <SectionTitle>8. Contato</SectionTitle>
                    <Paragraph>
                        Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato conosco através de um dos canais abaixo:
                    </Paragraph>
                    <div ref={addToRefs} className="mt-6 space-y-4 scroll-reveal">
                        <div className="flex items-center text-lg text-body">
                            <MailIcon className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                            <a href="mailto:hceesquadrias@yahoo.com" className="hover:text-primary transition-colors duration-300">
                                hceesquadrias@yahoo.com
                            </a>
                        </div>
                        <div className="flex items-center text-lg text-body">
                            <WhatsAppIcon className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                            <a href="https://wa.me/5561993619554" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
                                (61) 9 9361-9554
                            </a>
                        </div>
                        <div className="flex items-center text-lg text-body">
                            <InstagramIcon className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                            <a href="https://www.instagram.com/hce_esquadrias" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
                                @hce_esquadrias
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* CTA Section */}
            <ImmersiveSection backgroundImage={IMAGES.about.cta.background}>
                <div className="text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                            <KineticText text="Dúvidas sobre seus dados?" />
                        </h2>
                        <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Nossa equipe está à disposição para esclarecer qualquer questão sobre nossa política de privacidade e segurança.
                        </p>
                        <div>
                            <Link
                                to="/contato"
                                className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect"
                            >
                                Falar com a HCE
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </ImmersiveSection>
        </div>
    );
};

export default PrivacyPolicyPage;