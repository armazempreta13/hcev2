import React from 'react';
import { 
    QuoteIcon, 
    WhatsAppIcon, 
    ServicesIcon, 
    PortfolioIcon,
    QuestionIcon,
    CogIcon,
    UserTieIcon,
    ArrowLeftIcon,
    UserIcon,
    BriefcaseIcon
} from '../icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    QuoteIcon,
    WhatsAppIcon,
    ServicesIcon,
    PortfolioIcon,
    QuestionIcon,
    CogIcon,
    UserTieIcon,
    ArrowLeftIcon,
    UserIcon,
    BriefcaseIcon
};

export const getIconComponent = (iconName?: string): React.FC<{ className?: string }> | null => {
    if (!iconName || !iconMap[iconName]) {
        return null;
    }
    return iconMap[iconName];
};