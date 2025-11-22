import React from 'react';
import { IMAGES } from '../utils/images';

const Loader: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-soft-gray">
        <div className="relative flex justify-center items-center">
            <div className="absolute w-24 h-24 rounded-full animate-spin border-4 border-dashed border-primary"></div>
            <img src={IMAGES.identity.loaderSymbol} alt="Carregando HCE Esquadrias" className="w-16 h-16" />
        </div>
    </div>
);

export default Loader;