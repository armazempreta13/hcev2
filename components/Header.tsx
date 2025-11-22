
import React, { useState, useEffect, memo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { MenuIcon, CloseIcon } from './icons';
import ImageWithLoader from './ui/ImageWithLoader';
import { IMAGES } from './utils/images';
import { TEXTS } from './utils/texts';
import { CONFIG } from './utils/config';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Define navigation items using centralized texts
    const navItems = [
        { path: '/', label: TEXTS.header.nav.home, end: true },
        { path: '/sobre', label: TEXTS.header.nav.about },
        { path: '/servicos', label: TEXTS.header.nav.services },
        { path: '/portfolio', label: TEXTS.header.nav.portfolio },
        { path: '/equipe', label: TEXTS.header.nav.team },
    ];

    // Scroll detection logic
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Body scroll lock when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close menu on resize (if switching from mobile to desktop view)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    // Helper for Desktop Link Classes
    const getDesktopLinkClasses = (isActive: boolean) => {
        const baseClasses = "relative font-medium tracking-wide transition-colors duration-300";
        const colorClasses = "text-primary hover:text-accent-dark";
        const afterClasses = `after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:opacity-70 after:transition-all after:duration-300 hover:after:w-full`;
        const activeClasses = isActive ? "text-accent-dark after:w-full" : "";

        return `${baseClasses} ${colorClasses} ${afterClasses} ${activeClasses}`;
    };

    // Helper for Mobile Link Classes
    const getMobileLinkClasses = (isActive: boolean) => {
        const baseClasses = "relative text-white font-medium tracking-wide transition-colors duration-300 hover:text-white/80 text-2xl py-2";
        const afterClasses = "after:content-[''] after:absolute after:bottom-[4px] after:left-0 after:w-0 after:h-[2px] after:bg-white/50 after:transition-all after:duration-300 hover:after:w-full";
        const activeClasses = isActive ? "after:w-full" : "";

        return `${baseClasses} ${afterClasses} ${activeClasses}`;
    };
    
    const BudgetButton = () => {
        const whatsappNumber = TEXTS.global.contact.phoneDisplay.replace(/\D/g, '');
        
        if (CONFIG.behavior.directWhatsApp) {
            return (
                <a 
                    href={`https://wa.me/${whatsappNumber}`}
                    target={CONFIG.behavior.openLinksInNewTab ? "_blank" : "_self"}
                    rel={CONFIG.behavior.openLinksInNewTab ? "noopener noreferrer" : undefined}
                    className="shimmer-effect bg-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40"
                >
                    {TEXTS.global.buttons.budget}
                </a>
            );
        }
        
        return (
            <Link to="/contato" className="shimmer-effect bg-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40">
                {TEXTS.global.buttons.budget}
            </Link>
        );
    };
    
    const MobileBudgetButton = () => {
         const whatsappNumber = TEXTS.global.contact.phoneDisplay.replace(/\D/g, '');
         
         if (CONFIG.behavior.directWhatsApp) {
            return (
                <a 
                    href={`https://wa.me/${whatsappNumber}`}
                    target={CONFIG.behavior.openLinksInNewTab ? "_blank" : "_self"}
                    rel={CONFIG.behavior.openLinksInNewTab ? "noopener noreferrer" : undefined}
                    className="shimmer-effect bg-white text-primary font-bold uppercase px-10 py-5 rounded-full transition-transform duration-300 hover:scale-105 mt-8 shadow-lg active:scale-95 w-full text-center max-w-xs"
                    onClick={() => setIsOpen(false)}
                >
                    {TEXTS.global.buttons.requestBudget}
                </a>
            );
         }
         
         return (
            <Link 
                to="/contato" 
                className="shimmer-effect bg-white text-primary font-bold uppercase px-10 py-5 rounded-full transition-transform duration-300 hover:scale-105 mt-8 shadow-lg active:scale-95 w-full text-center max-w-xs" 
                onClick={() => setIsOpen(false)}
            >
                {TEXTS.global.buttons.requestBudget}
            </Link>
         );
    };

    return (
        // Z-Index updated to 1001 to ensure it sits above floating actions (z-999) and cookie banners
        <header className={`fixed top-0 w-full z-[1001] transition-all duration-300 ease-in-out ${isScrolled ? 'py-3 bg-white shadow-md border-b border-slate-900/10' : 'py-5 bg-white'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-50">
                <Link to="/" className="flex-shrink-0" onClick={handleHomeClick}>
                    <ImageWithLoader 
                        src={IMAGES.identity.logoColor} 
                        alt="HCE Esquadrias Logo" 
                        className="h-10 md:h-12 w-auto transition-transform duration-300 hover:scale-105" 
                        fetchPriority="high" 
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path}
                            to={item.path} 
                            end={item.end} 
                            className={({ isActive }) => getDesktopLinkClasses(isActive)}
                            onClick={item.path === '/' ? handleHomeClick : undefined}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <BudgetButton />
                </nav>

                {/* Mobile Menu Toggle Button (Visible when menu is closed) */}
                <div className="lg:hidden">
                    <button 
                        onClick={() => setIsOpen(true)} 
                        // Increased padding (p-4) for better touch target
                        className={`focus:outline-none p-4 -mr-4 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        aria-label="Abrir menu"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <MenuIcon className="w-8 h-8 text-primary" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                id="mobile-menu"
                className={`lg:hidden fixed inset-0 bg-primary z-[1002] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-hidden={!isOpen}
            >
                 {/* Mobile Header within Overlay (Logo + Close Button) */}
                 <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
                    <div className="pl-2">
                         {/* White Logo for Dark Menu Background - Using Footer Logo Source with invert filter */}
                         <ImageWithLoader 
                            src={IMAGES.identity.logoWhite} 
                            alt="HCE Logo" 
                            className="h-10 w-auto brightness-0 invert" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        // Increased padding for touch target
                        className="p-4 -mr-2 text-white hover:text-accent transition-colors focus:outline-none active:scale-90 transform duration-200"
                        aria-label="Fechar menu"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </button>
                 </div>

                 <div className="flex flex-col items-center justify-center h-full space-y-6 p-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path}
                            to={item.path} 
                            end={item.end} 
                            className={({ isActive }) => getMobileLinkClasses(isActive)}
                            onClick={(e) => {
                                if (item.path === '/') handleHomeClick(e);
                                else setIsOpen(false);
                            }}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    
                    <MobileBudgetButton />
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
