import { getAllStrategies, getTopStrategies } from './database';
import { Strategy, CategoryNode } from '@/types/strategy';

// This function creates category nodes with strategies from database
export async function getCategoryNodes(): Promise<CategoryNode[]> {
  const strategies = getAllStrategies(true); // Only active strategies
  
  return [
    {
      id: 'native_btc',
      label: 'Native BTC',
      category: 'native_btc',
      children: [
        {
          id: 'native_btc_all',
          label: 'All Native BTC',
          subcategory: undefined,
          strategies: strategies.filter(s => s.category === 'native_btc')
        }
      ]
    },
    {
      id: 'cex_lst',
      label: 'CEX LST',
      category: 'cex_lst',
      children: [
        {
          id: 'cex_lst_all',
          label: 'All CEX LST',
          subcategory: undefined,
          strategies: strategies.filter(s => s.category === 'cex_lst')
        }
      ]
    },
    {
      id: 'onchain_lst',
      label: 'On-chain LST',
      category: 'onchain_lst',
      children: [
        {
          id: 'onchain_dex_lp',
          label: 'DEX LPs',
          subcategory: 'dex_lp',
          strategies: strategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'dex_lp')
        },
        {
          id: 'onchain_lending_lp',
          label: 'Lending LPs',
          subcategory: 'lending_lp',
          strategies: strategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'lending_lp')
        },
        {
          id: 'onchain_perp_dex_lp',
          label: 'Perp DEX LPs',
          subcategory: 'perp_dex_lp',
          strategies: strategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'perp_dex_lp')
        },
        {
          id: 'onchain_crosschain_lp',
          label: 'Cross-chain LPs',
          subcategory: 'crosschain_lp',
          strategies: strategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'crosschain_lp')
        },
        {
          id: 'onchain_alt_lp',
          label: 'Alternative LPs',
          subcategory: 'alt_lp',
          strategies: strategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'alt_lp')
        }
      ]
    },
    {
      id: 'babylon_core',
      label: 'Babylon Core',
      category: 'babylon_core',
      children: [
        {
          id: 'babylon_core_all',
          label: 'All Babylon Core',
          subcategory: undefined,
          strategies: strategies.filter(s => s.category === 'babylon_core')
        }
      ]
    },
    {
      id: 'l2_strategies',
      label: 'L2 Strategies',
      category: 'l2_strategies',
      children: [
        {
          id: 'l2_dex_lp',
          label: 'DEX LPs',
          subcategory: 'dex_lp',
          strategies: strategies.filter(s => s.category === 'l2_strategies' && s.subcategory === 'dex_lp')
        },
        {
          id: 'l2_crosschain_lp',
          label: 'Cross-chain LPs',
          subcategory: 'crosschain_lp',
          strategies: strategies.filter(s => s.category === 'l2_strategies' && s.subcategory === 'crosschain_lp')
        }
      ]
    }
  ];
}

export function getStrategies(): Strategy[] {
  return getAllStrategies(true);
}

export function getTopStrategiesFromDB(limit: number = 5): Strategy[] {
  return getTopStrategies(limit);
} 