import {
    FaWindowMaximize, FaBuilding, FaShieldAlt, FaGripLines,
    FaStar, FaGem, FaCrown
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import { TEXTS } from './texts';

// ==================== TIPOS ====================
export type ServiceId = 'windows_doors' | 'facades' | 'railings' | 'brises';
export type QualityId = 'standard' | 'premium' | 'luxury';

export interface PricingResult {
    total: number;
    materialCost: number;
    laborCost: number;
    estimatedDays: number;
}

export interface ServiceOption {
    id: ServiceId;
    name: string;
    icon: IconType;
}

export interface QualityLevel {
    id: QualityId;
    name: string;
    description: string;
    icon: IconType;
    complexityFactor: number;
}

// ==================== CONSTANTES DE CUSTO ====================
// Baseado em 7 funcionários, com um custo diário estimado por pessoa (salário + encargos + despesas)
const DAILY_LABOR_RATE_PER_PERSON = 150; // Custo diário por funcionário
const TEAM_SIZE = 7;
const LABOR_COST_PER_DAY = DAILY_LABOR_RATE_PER_PERSON * TEAM_SIZE; // Custo total da equipe por dia

// Custos base de material por metro quadrado para cada tipo de serviço
const MATERIAL_COSTS: Record<ServiceId, number> = {
    windows_doors: 280,   // Custo base para janelas e portas
    facades: 450,         // Custo maior para pele de vidro/fachadas
    railings: 220,        // Custo para guarda-corpos
    brises: 350,          // Custo para ripados e brises
};

// Fator de produtividade: quantos m² a equipe consegue executar por dia, em média.
const DAILY_EXECUTION_RATE_SQM = 10;

// Margem de lucro e custos indiretos
const PROFIT_MARGIN = 1.25; // 25% de margem

// ==================== DADOS PARA UI ====================
export const serviceOptions: ServiceOption[] = [
    { id: 'windows_doors', name: TEXTS.pricing.services.windows_doors, icon: FaWindowMaximize },
    { id: 'facades', name: TEXTS.pricing.services.facades, icon: FaBuilding },
    { id: 'railings', name: TEXTS.pricing.services.railings, icon: FaShieldAlt },
    { id: 'brises', name: TEXTS.pricing.services.brises, icon: FaGripLines },
];

export const qualityLevels: QualityLevel[] = [
    { 
        id: 'standard', 
        name: TEXTS.pricing.quality.standard.name,
        description: TEXTS.pricing.quality.standard.desc,
        icon: FaStar,
        complexityFactor: 1.0 
    },
    { 
        id: 'premium', 
        name: TEXTS.pricing.quality.premium.name,
        description: TEXTS.pricing.quality.premium.desc,
        icon: FaGem,
        complexityFactor: 1.35
    },
    { 
        id: 'luxury', 
        name: TEXTS.pricing.quality.luxury.name,
        description: TEXTS.pricing.quality.luxury.desc,
        icon: FaCrown,
        complexityFactor: 1.8 
    },
];

// ==================== FUNÇÃO DE CÁLCULO ====================

export function calculateEstimate(
    serviceId: ServiceId,
    area: number,
    qualityId: QualityId
): PricingResult | null {
    if (!serviceId || area <= 0 || !qualityId) {
        return null;
    }

    const quality = qualityLevels.find(q => q.id === qualityId);
    if (!quality) {
        return null;
    }

    // 1. Calcular custo base do material
    const baseMaterialCost = MATERIAL_COSTS[serviceId] * area;

    // 2. Ajustar custo do material pela complexidade/qualidade
    const materialCost = baseMaterialCost * quality.complexityFactor;

    // 3. Estimar dias de trabalho
    // A complexidade também afeta o tempo de execução
    const estimatedDays = Math.ceil((area / DAILY_EXECUTION_RATE_SQM) * quality.complexityFactor);

    // 4. Calcular custo da mão de obra
    const laborCost = estimatedDays * LABOR_COST_PER_DAY;

    // 5. Calcular subtotal e total final com margem
    const subtotal = materialCost + laborCost;
    const total = subtotal * PROFIT_MARGIN;

    return {
        total,
        materialCost,
        laborCost,
        estimatedDays,
    };
}