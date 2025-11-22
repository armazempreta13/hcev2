import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MailIcon, LocationIcon, InstagramIcon, WhatsAppIcon } from './icons';
import { Tooltip } from './ui/Tooltip';
import ImageWithLoader from './ui/ImageWithLoader';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';

const logos = [
    { src: IMAGES.partners.hydro, alt: 'Hydro', tooltip: 'Parceiro Hydro: Alumínio de alta performance.' },
    { src: IMAGES.partners.abnt, alt: 'ABNT', tooltip: 'Certificação ABNT: Qualidade e segurança.' },
    { src: IMAGES.partners.iso9001, alt: 'ISO 9001', tooltip: 'Certificação ISO 9001: Processos de qualidade.' },
    { src: IMAGES.partners.nr35, alt: 'NR 35', tooltip: 'Certificação NR 35: Segurança no Trabalho em Altura.' },
    { src: IMAGES.partners.nr12, alt: 'NR 12', tooltip: 'Certificação NR 12: Segurança em Máquinas.' },
    { src: IMAGES.partners.nr18, alt: 'NR 18', tooltip: 'Certificação NR 18: Construção Civil.' },
    { src: IMAGES.partners.nr06, alt: 'NR 06', tooltip: 'Certificação NR 06: Equipamento de Proteção Individual.' }
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-white font-poppins">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4">
                        <Link to="/">
                           {/* Added brightness-0 invert to make logo completely white */}
                           <ImageWithLoader 
                                src={IMAGES.identity.logoWhite} 
                                alt="HCE Esquadrias Logo" 
                                className="h-12 w-auto brightness-0 invert filter" 
                            />
                        </Link>
                        <p className="text-light-bg/80 text-sm">
                            {TEXTS.footer.description1}
                        </p>
                        <p className="text-light-bg/80 text-sm">
                            {TEXTS.footer.description2}
                        </p>
                    </div>

                    {/* Column 2: Quick Navigation */}
                    <div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-4">{TEXTS.footer.titles.navigation}</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-accent transition-colors duration-300">{TEXTS.header.nav.home}</Link></li>
                            <li><Link to="/sobre" className="hover:text-accent transition-colors duration-300">{TEXTS.header.nav.about}</Link></li>
                            <li><Link to="/servicos" className="hover:text-accent transition-colors duration-300">{TEXTS.header.nav.services}</Link></li>
                            <li><Link to="/portfolio" className="hover:text-accent transition-colors duration-300">{TEXTS.header.nav.portfolio}</Link></li>
                            <li><Link to="/equipe" className="hover:text-accent transition-colors duration-300">{TEXTS.header.nav.team}</Link></li>
                            <li><Link to="/contato" className="hover:text-accent transition-colors duration-300">{TEXTS.footer.titles.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-4">{TEXTS.footer.titles.contact}</h3>
                        <ul className="space-y-3 text-light-bg/90">
                            <li className="flex items-start">
                                <LocationIcon className="w-5 h-5 mr-3 mt-1 text-accent flex-shrink-0" />
                                <span>{TEXTS.global.contact.address}</span>
                            </li>
                            <li className="flex items-center">
                                <PhoneIcon className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                                <a href={`tel:${TEXTS.global.contact.phoneDisplay.replace(/\D/g, '')}`} className="hover:text-accent transition-colors duration-300">{TEXTS.global.contact.phoneDisplay}</a>
                            </li>
                            <li className="flex items-center">
                                <MailIcon className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                                <a href={`mailto:${TEXTS.global.contact.email}`} className="hover:text-accent transition-colors duration-300">{TEXTS.global.contact.email}</a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Column 4: Social and Hours */}
                    <div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-4">{TEXTS.footer.titles.followUs}</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="https://www.instagram.com/hce_esquadrias" target="_blank" rel="noopener noreferrer" aria-label="Instagram da HCE Esquadrias" className="text-light-bg/80 hover:text-accent transition-colors duration-300">
                                <InstagramIcon className="w-6 h-6" />
                            </a>
                            <a href="https://wa.me/5561993619554" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da HCE Esquadrias" className="text-light-bg/80 hover:text-accent transition-colors duration-300">
                                <WhatsAppIcon className="w-6 h-6" />
                            </a>
                        </div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-2">{TEXTS.footer.titles.serviceHours}</h3>
                        <p className="text-light-bg/90 text-sm">{TEXTS.global.contact.hours.short}</p>
                    </div>
                </div>

                {/* Logo Scroller Section */}
                <div className="mt-16 text-center">
                    <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-8">{TEXTS.footer.titles.partners}</h3>
                    <div className="logo-scroller">
                        <div className="scroller-inner">
                            {logos.map((logo, index) => (
                                <Tooltip key={index} content={logo.tooltip} position="top">
                                    <ImageWithLoader src={logo.src} alt={logo.alt} className="scroller-logo" />
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-light-bg/20 pt-6 text-sm text-light-bg/60">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                        <p>&copy; {new Date().getFullYear()} {TEXTS.global.brandName}. {TEXTS.footer.copyright}</p>
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <p>CNPJ: 10.987.654/0001-32</p>
                            <span className="hidden md:block">|</span>
                            <Link to="/politica-de-privacidade" className="hover:text-accent transition-colors duration-300">{TEXTS.footer.links.privacy}</Link>
                            <span className="hidden md:block">|</span>
                            <Link to="/termos-de-uso" className="hover:text-accent transition-colors duration-300">{TEXTS.footer.links.terms}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);