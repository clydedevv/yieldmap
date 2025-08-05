export type StrategyCategory = 
  | 'native_btc'
  | 'cex_lst'
  | 'onchain_lst'
  | 'babylon_core'
  | 'l2_strategies';

export type StrategySubcategory = 
  | 'dex_lp'
  | 'lending_lp'
  | 'perp_dex_lp'
  | 'crosschain_lp'
  | 'alt_lp';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface YieldSource {
  name: string;
  icon: string; // emoji or icon identifier
  description?: string;
}

export interface Chain {
  name: string;
  icon: string; // emoji or icon identifier
  color: string; // hex color for the chain
}

export interface Strategy {
  id: string;
  category: StrategyCategory;
  subcategory?: StrategySubcategory;
  name: string;
  yield_percent: number;
  min_yield_percent?: number;  // For ranges
  max_yield_percent?: number;  // For ranges
  description: string;
  entry_guide: string;
  notes?: string;
  last_updated_at: Date;
  url?: string;
  
  // New fields for enhanced strategy cards
  lockup_period_days?: number;
  is_audited: boolean;
  audit_url?: string;
  risk_level: RiskLevel;
  yield_sources: YieldSource[];
  chains: Chain[];
}

export interface CategoryNode {
  id: string;
  label: string;
  category: StrategyCategory;
  children?: SubcategoryNode[];
}

export interface SubcategoryNode {
  id: string;
  label: string;
  subcategory: StrategySubcategory;
  strategies: Strategy[];
}