export type FactorCategory =
  | 'Financial'
  | 'Career'
  | 'Emotional / Well-being'
  | 'Effort & Time'
  | 'Risk & Uncertainty'
  | 'Other';

export interface ProConItem {
  id: string;
  text: string;
  category: FactorCategory;
  impact: 1 | 2 | 3 | 4 | 5; // 1 = minor, 5 = critical/life-altering
  rationale: string;
  isUserAdded?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  name: string;
  summary: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotAnalysis;
  keyAssumptions: string[];
}

export interface CriterionScore {
  optionName: string;
  score: number; // 1 to 10
  rationale: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 10
  scores: CriterionScore[];
}

export interface CognitiveBiasCheck {
  biasName: string;
  description: string;
  reflectionQuestion: string;
}

export interface DecisionRuling {
  bottomLineVerdict: string;
  recommendedOptionName: string;
  confidenceLevel: 'High' | 'Moderate' | 'Close Call';
  rulingRationale: string;
  ifThenRules: Array<{
    condition: string;
    recommendedOption: string;
  }>;
  tenTenTen: {
    inTenMinutes: string;
    inTenMonths: string;
    inTenYears: string;
  };
  cognitiveBiases: CognitiveBiasCheck[];
  lowStakesTest: string;
  preMortem: {
    worstCaseScenario: string;
    bestCaseScenario: string;
    preventativeStep: string;
  };
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  options: OptionAnalysis[];
  criteria: ComparisonCriterion[];
  ruling: DecisionRuling;
  customCriteriaWeights?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  tag?: string;
}

export type ActiveTab =
  | 'ruling'
  | 'pros-cons'
  | 'comparison'
  | 'swot'
  | 'psychology';
