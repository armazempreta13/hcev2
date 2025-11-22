import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal, KineticText } from './ui/Animations';
import { MailIcon, WhatsAppIcon, ArrowRightIcon } from './icons';
import ImmersiveSection from './ui/ImmersiveSection';
import { IMAGES } from './utils/images';

const TermsOfUsePage: React.FC = () => {
    useEffect(() => {
        document.title = 'Termos de Uso | HCE Esquadrias';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Leia os Termos de Uso da HCE Esquadrias. Condições gerais de uso do site, propriedade intelectual, responsabilidades e disposições finais.');
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
                        <KineticText text="Termos de Uso" />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        Regras e diretrizes para o uso do nosso site e serviços digitais.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-4xl">
                <section>
                    <Paragraph>
                        Bem-vindo ao site da <strong>HCE Esquadrias</strong>. Ao acessar e utilizar este site, você concorda automaticamente com os Termos de Uso descritos abaixo. Caso não concorde com algum dos termos, recomendamos que não utilize nossos serviços digitais.
                    </Paragraph>

                    <SectionTitle>1. Aceitação dos Termos</SectionTitle>
                    <Paragraph>
                        Ao acessar o site da HCE Esquadrias, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
                    </Paragraph>

                    <SectionTitle>2. Propriedade Intelectual</SectionTitle>
                    <Paragraph>
                        Todo o conteúdo presente neste site, incluindo textos, imagens, logotipos, vídeos, gráficos e códigos, é de propriedade exclusiva da HCE Esquadrias ou de seus parceiros licenciados, sendo protegido pelas leis de direitos autorais e propriedade intelectual vigentes no Brasil.
                    </Paragraph>
                    <Paragraph>
                        É expressamente proibido:
                    </Paragraph>
                    <ul>
                        <ListItem>Reproduzir, duplicar, copiar, vender ou explorar qualquer parte do conteúdo sem permissão expressa por escrito.</ListItem>
                        <ListItem>Utilizar a marca HCE Esquadrias para fins comerciais não autorizados.</ListItem>
                        <ListItem>Modificar ou copiar os materiais para uso comercial ou de exibição pública.</ListItem>
                    </ul>

                    <SectionTitle>3. Uso do Site</SectionTitle>
                    <Paragraph>
                        Nosso site tem como objetivo apresentar nossos produtos, serviços e portfólio, além de facilitar o contato para orçamentos. Você concorda em utilizar o site apenas para fins lícitos e de maneira que não infrinja os direitos de terceiros ou restrinja o uso do site por outros usuários.
                    </Paragraph>

                    <SectionTitle>4. Isenção de Responsabilidade</SectionTitle>
                    <Paragraph>
                        Os materiais no site da HCE Esquadrias são fornecidos "como estão". A HCE Esquadrias não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual.
                    </Paragraph>
                    <Paragraph>
                        Além disso, a HCE Esquadrias não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a tais materiais ou em sites vinculados a este site.
                    </Paragraph>

                    <SectionTitle>5. Links Externos</SectionTitle>
                    <Paragraph>
                        Nosso site pode conter links para sites de terceiros (parceiros, fornecedores, redes sociais). A HCE Esquadrias não controla esses sites e não se responsabiliza pelo conteúdo ou pelas práticas de privacidade de sites externos. A inclusão de qualquer link não implica endosso por parte da HCE Esquadrias.
                    </Paragraph>

                    <SectionTitle>6. Limitação de Responsabilidade</SectionTitle>
                    <Paragraph>
                        Em nenhum caso a HCE Esquadrias ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais da HCE Esquadrias, mesmo que a HCE Esquadrias ou um representante autorizado tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
                    </Paragraph>

                    <SectionTitle>7. Modificações</SectionTitle>
                    <Paragraph>
                        A HCE Esquadrias pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
                    </Paragraph>

                    <SectionTitle>8. Foro e Legislação Aplicável</SectionTitle>
                    <Paragraph>
                        Estes termos são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de Brasília - DF para dirimir quaisquer controvérsias oriundas destes Termos de Uso.
                    </Paragraph>

                    <SectionTitle>9. Contato</SectionTitle>
                    <Paragraph>
                        Para esclarecimentos sobre estes Termos de Uso, entre em contato conosco:
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
                    </div>
                </section>
            </main>

            {/* CTA Section */}
            <ImmersiveSection backgroundImage={IMAGES.home.cta.background}>
                <div className="text-center">
                    <div ref={addToRefs} className="scroll-reveal">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6">
                            <KineticText text="Precisa de ajuda?" />
                        </h2>
                        <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Se tiver qualquer dúvida sobre os termos de uso, nossa equipe está pronta para ajudar.
                        </p>
                        <div>
                            <Link
                                to="/contato"
                                className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect"
                            >
                                Entrar em Contato
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </ImmersiveSection>
        </div>
    );
};

export default TermsOfUsePage;