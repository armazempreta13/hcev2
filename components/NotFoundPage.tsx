import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from './icons';
import { KineticText, useScrollReveal } from './ui/Animations';
import { TEXTS } from './utils/texts';

const NotFoundPage: React.FC = () => {
    useEffect(() => {
        document.title = '404 - Página Não Encontrada | HCE Esquadrias';
    }, []);

    const addToRefs = useScrollReveal();

    return (
        <div className="bg-soft-gray flex items-center justify-center min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8 text-center">
            <div ref={addToRefs} className="max-w-xl scroll-reveal">
                <div className="relative inline-block">
                    <h1 className="font-armstrong text-8xl md:text-9xl font-bold text-primary opacity-20">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase text-heading tracking-tight">
                            <KineticText text={TEXTS.notFound.title} />
                        </h2>
                    </div>
                </div>
                <p className="mt-8 text-lg sm:text-xl text-body max-w-md mx-auto">
                    {TEXTS.notFound.description}
                </p>
                <div className="mt-12">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center bg-primary text-white font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shimmer-effect"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-3"/>
                        {TEXTS.global.buttons.backHome}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;