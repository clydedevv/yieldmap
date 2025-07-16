'use client';

import React, { useState, useMemo } from 'react';
import { Strategy, StrategyCategory, RiskLevel } from '@/types/strategy';
import { mockStrategies } from '@/data/mockData';

interface FlowChartProps {
  onStrategySelect?: (strategy: Strategy) => void;
}

const categoryLabels: Record<StrategyCategory, string> = {
  native_btc: 'Native BTC',
  cex_lst: 'CEX LST',
  onchain_lst: 'On-chain LST',
  babylon_core: 'Security-as-a-Service',
  l2_strategies: 'L2 Strategies'
};

const riskLevelLabels: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const riskLevelColors: Record<RiskLevel, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export default function FlowChart({ onStrategySelect }: FlowChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredStrategies = useMemo(() => {
    return mockStrategies.filter(strategy => {
      const categoryMatch = selectedCategory === 'all' || strategy.category === selectedCategory;
      const typeMatch = selectedType === 'all' || strategy.subcategory === selectedType;
      
      return categoryMatch && typeMatch;
    });
  }, [selectedCategory, selectedType]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'native_btc', label: 'Native BTC' },
    { id: 'cex_lst', label: 'CEX LST' },
    { id: 'onchain_lst', label: 'On-chain LST' },
    { id: 'babylon_core', label: 'Security-as-a-Service' },
    { id: 'l2_strategies', label: 'L2 Strategies' }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'dex_lp', label: 'DEX LP' },
    { id: 'lending_lp', label: 'Lending LP' },
    { id: 'perp_dex_lp', label: 'Perp DEX LP' },
    { id: 'crosschain_lp', label: 'Cross-chain LP' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Categories and Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as StrategyCategory | 'all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Yield
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lockup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Audit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStrategies.map((strategy) => (
                <tr 
                  key={strategy.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onStrategySelect?.(strategy)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{strategy.name}</div>
                      <div className="text-sm text-slate-500">{strategy.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-green-600">
                      {strategy.yield_percent}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {categoryLabels[strategy.category]}
                    </div>
                    {strategy.subcategory && (
                      <div className="text-xs text-slate-500 capitalize">
                        {strategy.subcategory.replace('_', ' ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskLevelColors[strategy.risk_level]}`}>
                      {riskLevelLabels[strategy.risk_level]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {strategy.lockup_period_days === 0 ? 'None' : `${strategy.lockup_period_days} days`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {strategy.is_audited ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          ✓ Audited
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          ✗ Not Audited
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredStrategies.length} of {mockStrategies.length} strategies
      </div>
    </div>
  );
}