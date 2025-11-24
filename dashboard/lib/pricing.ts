/**
 * Pricing Configuration - FIXER by Helping Hand Subscription Plans
 */

export interface PricingPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  description: string;
  monthlyPrice: number;
  setupFee: number;
  monthlyCallLimit: number;
  overagePricePerCall: number;
  maxAgents: number;
  features: string[];
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'AI secretary for small businesses',
    monthlyPrice: 109,
    setupFee: 99,
    monthlyCallLimit: 100,
    overagePricePerCall: 0.50,
    maxAgents: 1,
    features: [
      '100 calls/month included',
      'WhatsApp support for real-time notifications',
      'Access to web interface for tailored statistics',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'AI secretary for growing businesses',
    monthlyPrice: 179,
    setupFee: 149,
    monthlyCallLimit: 500,
    overagePricePerCall: 0.40,
    maxAgents: 3,
    features: [
      '500 calls/month included',
      'Up to 3 WhatsApp agents',
      'Advanced web interface with comprehensive analytics and CRM',
      'Custom prompt configuration',
      'Data export capabilities',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'AI secretary for established businesses',
    monthlyPrice: 329,
    setupFee: 199,
    monthlyCallLimit: 2000,
    overagePricePerCall: 0.30,
    maxAgents: 10,
    features: [
      '2000 calls/month included',
      'Up to 10 WhatsApp agents',
      'White-label web interface with advanced analytics and full CRM',
      'Custom prompt configuration with API access',
      'Priority support',
      'Data export in multiple formats',
    ],
  },
};

export function calculateMonthlyCost(
  plan: PricingPlan,
  actualCalls: number
): {
  basePrice: number;
  includedCalls: number;
  extraCalls: number;
  overageCost: number;
  totalCost: number;
} {
  const basePrice = plan.monthlyPrice;
  const includedCalls = plan.monthlyCallLimit;
  const extraCalls = Math.max(0, actualCalls - includedCalls);
  const overageCost = extraCalls * plan.overagePricePerCall;
  const totalCost = basePrice + overageCost;

  return {
    basePrice,
    includedCalls,
    extraCalls,
    overageCost,
    totalCost,
  };
}

export function hasExceededLimit(plan: PricingPlan, actualCalls: number): boolean {
  return actualCalls > plan.monthlyCallLimit;
}

export function getUsagePercentage(plan: PricingPlan, actualCalls: number): number {
  if (plan.monthlyCallLimit === 0) return 0;
  return Math.min(100, Math.round((actualCalls / plan.monthlyCallLimit) * 100));
}

