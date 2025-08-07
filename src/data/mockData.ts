import { Strategy, CategoryNode } from '@/types/strategy';

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    category: 'l2_strategies',
    subcategory: 'perp_dex_lp',
    name: 'Dolomite + GMX Glove BTC',
    yield_percent: 17.5,
    description: 'Loop BTC liquidity on Dolomite integrated with GMX perpetuals for amplified yields from trading fees and incentives on Arbitrum.',
    entry_guide: 'Connect wallet to Dolomite, deposit BTC, enable looping with GMX integration for amplified perpetual trading yields.',
    notes: 'High leverage strategy increases liquidation risk. Strong yields from perp DEX LP exposure but requires active risk management. Market conditions can change rapidly.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://dolomite.io/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://github.com/dolomite-io/audits',
    risk_level: 'high',
    yield_sources: [
      { name: 'Trading Fees', icon: '💱' },
      { name: 'Perpetual Incentives', icon: '🎯' },
      { name: 'Loop Amplification', icon: '🔄' }
    ],
    chains: [
      { name: 'Arbitrum', icon: '🔵', color: '#28A0F0' }
    ]
  },
  {
    id: '2',
    category: 'l2_strategies',
    subcategory: 'dex_lp',
    name: 'Velodrome WBTC/M-BTC LP',
    yield_percent: 14.2,
    description: 'Provide liquidity to the WBTC/M-BTC pair on Velodrome (Optimism), boosted by temporary incentives from Merkl.',
    entry_guide: 'Connect to Velodrome on Optimism, add liquidity to WBTC/M-BTC pair, stake LP tokens for Merkl incentives.',
    notes: 'DEX LP with impermanent loss risk. Yields are incentive-dependent and may decrease when temporary programs end. Monitor pair correlation.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://velodrome.finance/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://velodrome.finance/audits',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Trading Fees', icon: '💱' },
      { name: 'Merkl Incentives', icon: '🎁' },
      { name: 'Velodrome Rewards', icon: '🏆' }
    ],
    chains: [
      { name: 'Optimism', icon: '🔴', color: '#FF0420' }
    ]
  },
  {
    id: '3',
    category: 'onchain_lst',
    name: 'Neutron maxBTC Vault',
    yield_percent: 12.5,
    description: 'Stake BTC in Neutron\'s maxBTC vault for auto-compounding yields from leveraged looping and basis trading.',
    entry_guide: 'Deposit BTC into Neutron maxBTC vault, enable auto-compounding for leveraged looping and basis trading strategies.',
    notes: 'Leveraged strategies with smart contract risks. Auto-compounding can amplify both gains and losses. Requires understanding of basis trading mechanics.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://neutron.org/',
    lockup_period_days: 10, // 7-14 days variable by vault settings
    is_audited: true,
    audit_url: 'https://neutron.org/security',
    risk_level: 'high',
    yield_sources: [
      { name: 'Leveraged Looping', icon: '🔄' },
      { name: 'Basis Trading', icon: '📊' },
      { name: 'Auto-compounding', icon: '⚡' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '4',
    category: 'onchain_lst',
    subcategory: 'dex_lp',
    name: 'SolvProtocol BTC on LFJ',
    yield_percent: 10.8,
    description: 'Stake BTC in SolvBTC pools on LFJ DEX, earning from incentives; upcoming incentives on SolvBTC/AVAX pairs.',
    entry_guide: 'Stake BTC through Solv Protocol to get SolvBTC, then provide liquidity on LFJ DEX for additional incentives.',
    notes: 'DEX LP risks with protocol-specific incentives. Monitor upcoming SolvBTC/AVAX pair launches for additional opportunities.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://solv.finance/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://docs.solv.finance/solv-protocol/security/audits',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Solv Incentives', icon: '🎁' },
      { name: 'LFJ Rewards', icon: '🏆' },
      { name: 'LP Fees', icon: '💱' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' },
      { name: 'Avalanche', icon: '🔴', color: '#E84142' }
    ]
  },
  {
    id: '5',
    category: 'onchain_lst',
    subcategory: 'lending_lp',
    name: 'Midas mBTC on Euler',
    yield_percent: 10.1,
    description: 'Stake mBTC for native yield and loop on Apostro-integrated Euler market.',
    entry_guide: 'Stake BTC for mBTC (3% native yield), then use Apostro integration on Euler for leveraged looping.',
    notes: 'Lending loop risks with borrower default potential. Euler has strong post-hack security measures but requires careful position management.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://midas.app/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://www.midas.app/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'mBTC Native Yield', icon: '🔥' },
      { name: 'Loop Amplification', icon: '🔄' },
      { name: 'Euler Interest', icon: '📈' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '6',
    category: 'l2_strategies',
    name: 'f(x) Protocol Basis Trade',
    yield_percent: 10.0,
    description: 'Long/short strategy with leveraged ETH perpetuals for BTC basis yields.',
    entry_guide: 'Use f(x) Protocol to enter basis trade positions with leveraged ETH perpetuals for BTC-denominated yields.',
    notes: 'Basis trade volatility with leverage risks. Requires understanding of perpetual funding rates and ETH/BTC correlation dynamics.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://fx.aladdin.club/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://fx.aladdin.club/security',
    risk_level: 'high',
    yield_sources: [
      { name: 'Basis Trading', icon: '📊' },
      { name: 'Perpetual Funding', icon: '💱' },
      { name: 'Leverage Premium', icon: '⚡' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '7',
    category: 'onchain_lst',
    name: 'Ether.fi Liquid BTC Vault',
    yield_percent: 9.5,
    description: 'Stake BTC in liquid vault for yields plus ETHFI rewards; usable as collateral for spending.',
    entry_guide: 'Deposit BTC into Ether.fi liquid vault, receive liquid BTC tokens that can be used as collateral while earning yields.',
    notes: 'Liquid staking with peg risks and promotional incentives. Monitor ETHFI reward sustainability and liquid BTC token peg stability.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://ether.fi/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://docs.ether.fi/ether.fi/security/audits',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Staking Yields', icon: '🔥' },
      { name: 'ETHFI Rewards', icon: '🎁' },
      { name: 'Collateral Utility', icon: '🔗' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '8',
    category: 'babylon_core',
    name: 'Babylon BTC Staking',
    yield_percent: 9.2,
    description: 'Native Bitcoin staking through Babylon to secure PoS chains; self-custodial with no wrapping.',
    entry_guide: 'Stake native BTC through Babylon protocol to secure Proof-of-Stake chains while maintaining self-custody.',
    notes: 'Slashing risk if validators underperform. Early-stage protocol with innovative native BTC staking. No wrapping required but requires validator selection.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://babylonchain.io/',
    lockup_period_days: 21,
    is_audited: true,
    audit_url: 'https://docs.babylonchain.io/security/audits/',
    risk_level: 'high',
    yield_sources: [
      { name: 'Validator Rewards', icon: '🔥' },
      { name: 'PoS Security Fees', icon: '🛡️' },
      { name: 'Network Incentives', icon: '🎯' }
    ],
    chains: [
      { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { name: 'Babylon', icon: '🔶', color: '#FF6B35' }
    ]
  },
  {
    id: '9',
    category: 'onchain_lst',
    name: 'Core lstBTC Staking',
    yield_percent: 8.5,
    description: 'Stake BTC for liquid lstBTC with CORE rewards and dual staking benefits.',
    entry_guide: 'Stake BTC through Core protocol to receive lstBTC tokens with CORE reward incentives and dual staking capabilities.',
    notes: 'Staking rewards volatility with timelock requirements. Monitor CORE token price impact on total yields and lstBTC liquidity.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://coredao.org/',
    lockup_period_days: 7,
    is_audited: true,
    audit_url: 'https://coredao.org/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Staking Rewards', icon: '🔥' },
      { name: 'CORE Incentives', icon: '🎁' },
      { name: 'Dual Staking', icon: '⚡' }
    ],
    chains: [
      { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '10',
    category: 'cex_lst',
    name: 'Coinbase BTC DeFi Yield',
    yield_percent: 5.8,
    description: 'Lend BTC via Coinbase to DeFi protocols; custodial solution with regulatory compliance.',
    entry_guide: 'Use Coinbase platform to lend BTC to various DeFi protocols through their managed yield products.',
    notes: 'Centralized custody with regulatory compliance. Lower yields but higher security through established platform and insurance coverage.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://coinbase.com/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://coinbase.com/security',
    risk_level: 'low',
    yield_sources: [
      { name: 'DeFi Lending', icon: '📈' },
      { name: 'Platform Fees', icon: '🏦' },
      { name: 'Yield Optimization', icon: '⚡' }
    ],
    chains: [
      { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '11',
    category: 'l2_strategies',
    name: 'RateX fragBTC Fixed',
    yield_percent: 5.5,
    description: 'Fixed-rate yield on fragBTC perpetuals on Solana with predictable returns.',
    entry_guide: 'Use RateX platform on Solana to access fixed-rate fragBTC perpetual products for predictable BTC yields.',
    notes: 'Perp fixed-rate risks with Solana network dependencies. Fixed rates provide predictability but may underperform in high-yield environments.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://ratex.fi/',
    lockup_period_days: 30, // Variable (7-90 days, user-selected)
    is_audited: true,
    audit_url: 'https://ratex.fi/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Fixed Rate Premium', icon: '📊' },
      { name: 'Perpetual Fees', icon: '💱' },
      { name: 'fragBTC Yield', icon: '🔥' }
    ],
    chains: [
      { name: 'Solana', icon: '🟣', color: '#8247E5' }
    ]
  },
  {
    id: '12',
    category: 'onchain_lst',
    subcategory: 'lending_lp',
    name: 'Maple Finance BTC Yield',
    yield_percent: 5.1,
    description: 'Stake BTC in Maple\'s institutional lending pools for yields from emissions and fees.',
    entry_guide: 'Deposit BTC into Maple Finance pools to earn from institutional lending with emissions and fee sharing.',
    notes: 'Lending risks without slashing but potential defaults. Institutional focus provides stability but yields depend on borrower demand.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://maple.finance/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://maple.finance/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Lending Interest', icon: '📈' },
      { name: 'Pool Emissions', icon: '🎁' },
      { name: 'Management Fees', icon: '💼' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  },
  {
    id: '13',
    category: 'native_btc',
    name: 'Lightning Network Routing',
    yield_percent: 4.5,
    description: 'Earn fees by routing Lightning payments; yields vary by liquidity provision and uptime.',
    entry_guide: 'Run a Lightning node, open channels with good liquidity, maintain high uptime for routing fee earnings.',
    notes: 'Operational complexity with low smart contract risk. Requires technical expertise and significant upfront capital for channel liquidity.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://lightning.network/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://lightning.network/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Routing Fees', icon: '⚡' },
      { name: 'Channel Fees', icon: '🔗' },
      { name: 'Network Incentives', icon: '🎯' }
    ],
    chains: [
      { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { name: 'Lightning', icon: '⚡', color: '#FFA500' }
    ]
  },
  {
    id: '14',
    category: 'l2_strategies',
    name: 'Exponent Finance Fixed',
    yield_percent: 4.5,
    description: 'Fixed-rate BTC yields on Exponent protocol with predictable returns.',
    entry_guide: 'Access Exponent Finance fixed-rate products for predictable BTC yield generation.',
    notes: 'Fixed-rate market risks with protocol dependencies. Provides yield predictability but may miss upside in high-rate environments.',
    last_updated_at: new Date('2024-01-15'),
    url: 'https://exponents.fi/',
    lockup_period_days: 0,
    is_audited: true,
    audit_url: 'https://exponents.fi/security',
    risk_level: 'medium',
    yield_sources: [
      { name: 'Fixed Rate Premium', icon: '📊' },
      { name: 'Protocol Fees', icon: '💼' },
      { name: 'Yield Optimization', icon: '⚡' }
    ],
    chains: [
      { name: 'Ethereum', icon: '⟡', color: '#627EEA' }
    ]
  }
];

export const categoryNodes: CategoryNode[] = [
  {
    id: 'native',
    label: 'Native BTC',
    category: 'native_btc',
    children: []
  },
  {
    id: 'cex',
    label: 'CEX LST',
    category: 'cex_lst',
    children: []
  },
  {
    id: 'onchain',
    label: 'On-chain LST',
    category: 'onchain_lst',
    children: [
      {
        id: 'dex',
        label: 'DEX LP',
        subcategory: 'dex_lp',
        strategies: mockStrategies.filter(s => s.subcategory === 'dex_lp')
      },
      {
        id: 'lending',
        label: 'Lending LP',
        subcategory: 'lending_lp',
        strategies: mockStrategies.filter(s => s.subcategory === 'lending_lp')
      },
      {
        id: 'perp',
        label: 'Perp DEX LP',
        subcategory: 'perp_dex_lp',
        strategies: mockStrategies.filter(s => s.subcategory === 'perp_dex_lp')
      }
    ]
  },
  {
    id: 'babylon',
    label: 'Babylon Core',
    category: 'babylon_core',
    children: []
  },
  {
    id: 'l2',
    label: 'L2 Strategies',
    category: 'l2_strategies',
    children: [
      {
        id: 'crosschain',
        label: 'Cross-chain LP',
        subcategory: 'crosschain_lp',
        strategies: mockStrategies.filter(s => s.subcategory === 'crosschain_lp')
      }
    ]
  }
];

export const getTopStrategies = (limit: number = 5): Strategy[] => {
  return mockStrategies
    .sort((a, b) => b.yield_percent - a.yield_percent)
    .slice(0, limit);
};