import { Strategy, CategoryNode } from '@/types/strategy';

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    category: 'native_btc',
    name: 'Lightning Network Routing',
    yield_percent: 0.5,
    description: 'Earn fees by routing Lightning Network payments',
    entry_guide: 'Run a Lightning node and open channels with good liquidity',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://lightning.network/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://lightning.network/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Routing Fees', icon: '⚡' },
      { name: 'Channel Fees', icon: '🔗' }
    ]
  },
  {
    id: '2',
    category: 'cex_lst',
    name: 'Coinbase Prime BTC Staking',
    yield_percent: 4.2,
    description: 'Institutional BTC staking through Coinbase Prime',
    entry_guide: 'Requires Coinbase Prime account with minimum balance',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://prime.coinbase.com/',
    lockup_period_days: 21,
    is_audited: true,
    audit_url: 'https://coinbase.com/security',
    risk_level: 'low',
    yield_sources: [
      { name: 'Staking Rewards', icon: '⚡' },
      { name: 'Coinbase Prime', icon: '🏦' }
    ]
  },
  {
    id: '3',
    category: 'onchain_lst',
    subcategory: 'dex_lp',
    name: 'Uniswap V3 WBTC/ETH',
    yield_percent: 8.7,
    description: 'Provide liquidity to WBTC/ETH pair on Uniswap V3',
    entry_guide: 'Connect wallet, add liquidity to WBTC/ETH pool with chosen range',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://app.uniswap.org/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://uniswap.org/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Trading Fees', icon: '💰' },
      { name: 'UNI Rewards', icon: '🦄' }
    ]
  },
  {
    id: '4',
    category: 'onchain_lst',
    subcategory: 'lending_lp',
    name: 'Aave WBTC Lending',
    yield_percent: 3.1,
    description: 'Lend WBTC on Aave protocol',
    entry_guide: 'Connect wallet, deposit WBTC to Aave lending pool',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://aave.com/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://aave.com/security',
    risk_level: 'low',
    yield_sources: [
      { name: 'Interest Rates', icon: '💰' },
      { name: 'AAVE Tokens', icon: '👻' }
    ]
  },
  {
    id: '5',
    category: 'babylon_core',
    name: 'Babylon Staking',
    yield_percent: 6.8,
    description: 'Stake BTC to secure Babylon network',
    entry_guide: 'Use Babylon wallet to stake BTC',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://babylonchain.io/',
    lockup_period_days: 365,
    is_audited: true,
    audit_url: 'https://babylonchain.io/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Babylon Points', icon: '🔶' },
      { name: 'Staking Rewards', icon: '⚡' }
    ]
  },
  {
    id: '6',
    category: 'l2_strategies',
    subcategory: 'dex_lp',
    name: 'Arbitrum WBTC/USDC LP',
    yield_percent: 12.3,
    description: 'Provide liquidity on Arbitrum L2',
    entry_guide: 'Bridge to Arbitrum, provide liquidity on supported DEX',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://arbitrum.io/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://arbitrum.io/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Trading Fees', icon: '💰' },
      { name: 'ARB Rewards', icon: '🔷' }
    ]
  },
  {
    id: '7',
    category: 'onchain_lst',
    subcategory: 'perp_dex_lp',
    name: 'dYdX BTC Perp LP',
    yield_percent: 15.2,
    description: 'Provide liquidity to BTC perpetual futures',
    entry_guide: 'Connect wallet, deposit to dYdX perp pool',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://dydx.exchange/',
    lockup_period_days: 7,
    is_audited: true,
    audit_url: 'https://dydx.exchange/security',
    risk_level: 'high',
    yield_sources: [
      { name: 'Trading Fees', icon: '💰' },
      { name: 'DYDX Tokens', icon: '🌊' }
    ]
  },
  {
    id: '8',
    category: 'l2_strategies',
    subcategory: 'crosschain_lp',
    name: 'Thorchain BTC/RUNE',
    yield_percent: 18.9,
    description: 'Cross-chain liquidity pool on Thorchain',
    entry_guide: 'Use Thorswap to add liquidity to BTC/RUNE pool',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://thorchain.org/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://thorchain.org/security',
    risk_level: 'high',
    yield_sources: [
      { name: 'Trading Fees', icon: '💰' },
      { name: 'RUNE Rewards', icon: '🔺' },
      { name: 'Block Rewards', icon: '⚡' }
    ]
  }
];

export const categoryNodes: CategoryNode[] = [
  {
    id: 'native_btc',
    label: 'Native BTC Yield',
    category: 'native_btc',
    children: []
  },
  {
    id: 'cex_lst',
    label: 'CEX LSTs',
    category: 'cex_lst',
    children: []
  },
  {
    id: 'onchain_lst',
    label: 'On-chain LSTs',
    category: 'onchain_lst',
    children: [
      {
        id: 'dex_lp',
        label: 'DEX LPs',
        subcategory: 'dex_lp',
        strategies: mockStrategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'dex_lp')
      },
      {
        id: 'lending_lp',
        label: 'Lending LPs',
        subcategory: 'lending_lp',
        strategies: mockStrategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'lending_lp')
      },
      {
        id: 'perp_dex_lp',
        label: 'Perp DEX LPs',
        subcategory: 'perp_dex_lp',
        strategies: mockStrategies.filter(s => s.category === 'onchain_lst' && s.subcategory === 'perp_dex_lp')
      }
    ]
  },
  {
    id: 'babylon_core',
    label: 'Babylon/CoreDAO LSTs',
    category: 'babylon_core',
    children: []
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
        strategies: mockStrategies.filter(s => s.category === 'l2_strategies' && s.subcategory === 'dex_lp')
      },
      {
        id: 'l2_crosschain_lp',
        label: 'Cross-chain LPs',
        subcategory: 'crosschain_lp',
        strategies: mockStrategies.filter(s => s.category === 'l2_strategies' && s.subcategory === 'crosschain_lp')
      }
    ]
  }
];

export const getTopStrategies = (limit: number = 5): Strategy[] => {
  return mockStrategies
    .sort((a, b) => b.yield_percent - a.yield_percent)
    .slice(0, limit);
};