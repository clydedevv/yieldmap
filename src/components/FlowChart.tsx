'use client';

import React, { useState, useMemo, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Strategy, StrategyCategory, RiskLevel } from '@/types/strategy';
import { StrategyAPI } from '@/lib/api';

// Helper function to format yield display
const formatYieldDisplay = (strategy: Strategy): string => {
  if (strategy.min_yield_percent && strategy.max_yield_percent) {
    return `${strategy.min_yield_percent}% - ${strategy.max_yield_percent}%`;
  }
  return `${strategy.yield_percent}%`;
};

interface FlowChartProps {
  onStrategySelect?: (strategy: Strategy) => void;
  onNodeClick?: (category?: string, subcategory?: string, strategies?: Strategy[]) => void;
  categoryNodes?: unknown[];
  allStrategies?: Strategy[];
}

interface FlowChartRef {
  expandAndScrollToStrategy: (strategyId: string) => void;
}

type SortField = 'name' | 'yield_percent' | 'risk_level' | 'lockup_period_days' | 'category';
type SortDirection = 'asc' | 'desc';

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

const riskLevelOrder: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3
};

const FlowChart = forwardRef<FlowChartRef, FlowChartProps>(({ allStrategies: propsStrategies }, ref) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('yield_percent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (propsStrategies && propsStrategies.length > 0) {
      // Use strategies passed as props
      setStrategies(propsStrategies);
      setLoading(false);
    } else {
      // Load strategies from API
      loadStrategies();
    }
  }, [propsStrategies]);

  const loadStrategies = async () => {
    try {
      const data = await StrategyAPI.getAllStrategies(true);
      setStrategies(data);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    } finally {
      setLoading(false);
    }
  };
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleRowExpansion = (strategyId: string) => {
    const isExpanded = expandedRows.has(strategyId);
    
    if (isExpanded) {
      setExpandedRows(new Set([...expandedRows].filter(id => id !== strategyId)));
    } else {
      setExpandedRows(new Set([...expandedRows, strategyId]));
    }
  };

  const expandAndScrollToStrategy = (strategyId: string) => {
    // First, expand the row if not already expanded
    if (!expandedRows.has(strategyId)) {
      setExpandedRows(new Set([...expandedRows, strategyId]));
    }
    
    // Then scroll to the strategy row
    setTimeout(() => {
      const strategyRow = document.getElementById(`strategy-${strategyId}`);
      if (strategyRow && tableRef.current) {
        strategyRow.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Add a highlight effect
        strategyRow.classList.add('bg-orange-100');
        setTimeout(() => {
          strategyRow.classList.remove('bg-orange-100');
        }, 2000);
      }
    }, 100);
  };

  useImperativeHandle(ref, () => ({
    expandAndScrollToStrategy
  }));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredStrategies = useMemo(() => {
    const filtered = strategies; // Show all strategies without filtering

    // Sort the filtered strategies
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'yield_percent':
          aValue = a.yield_percent;
          bValue = b.yield_percent;
          break;
        case 'risk_level':
          aValue = riskLevelOrder[a.risk_level];
          bValue = riskLevelOrder[b.risk_level];
          break;
        case 'lockup_period_days':
          aValue = a.lockup_period_days || 0;
          bValue = b.lockup_period_days || 0;
          break;
        case 'category':
          aValue = categoryLabels[a.category].toLowerCase();
          bValue = categoryLabels[b.category].toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [strategies, sortField, sortDirection]);



  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 ml-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-slate-600">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6" ref={tableRef}>


      {/* Strategies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Strategy
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors w-28"
                  onClick={() => handleSort('yield_percent')}
                >
                  <div className="flex items-center">
                    Yield
                    <SortIcon field="yield_percent" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    <SortIcon field="category" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('risk_level')}
                >
                  <div className="flex items-center">
                    Risk
                    <SortIcon field="risk_level" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('lockup_period_days')}
                >
                  <div className="flex items-center">
                    Lockup
                    <SortIcon field="lockup_period_days" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Chains
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStrategies.map((strategy) => (
                <React.Fragment key={strategy.id}>
                  <tr 
                    id={`strategy-${strategy.id}`}
                    className={`cursor-pointer transition-colors duration-200 ease-in-out hover:bg-slate-50 ${
                      expandedRows.has(strategy.id) ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => toggleRowExpansion(strategy.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <svg 
                            className={`w-4 h-4 transition-all duration-200 ease-in-out ${
                              expandedRows.has(strategy.id) 
                                ? 'text-blue-600 transform rotate-0' 
                                : 'text-slate-400 transform -rotate-90'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{strategy.name}</div>
                          <div className="text-sm text-slate-500">{strategy.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-28">
                      <div className="text-sm font-bold text-green-600 whitespace-nowrap">
                        {formatYieldDisplay(strategy)}
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
                        {!strategy.lockup_period_days || strategy.lockup_period_days === 0 ? '—' : `${strategy.lockup_period_days} days`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {strategy.chains && strategy.chains.slice(0, 3).map((chain, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                            style={{ backgroundColor: chain.color + '20', color: chain.color }}
                            title={chain.name}
                          >
                            {chain.icon}
                          </div>
                        ))}
                        {strategy.chains && strategy.chains.length > 3 && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            +{strategy.chains.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(strategy.id) && (
                    <tr>
                      <td colSpan={6} className="px-0 py-0 bg-slate-50/30">
                        <div className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  
                                  {/* Entry Guide */}
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      Getting Started
                                    </h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                      {strategy.entry_guide}
                                    </p>
                                  </div>

                                  {/* Research Notes */}
                                  {strategy.notes && (
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                                      <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Research Notes
                                      </h4>
                                      <p className="text-sm text-amber-800 leading-relaxed">
                                        {strategy.notes}
                                      </p>
                                    </div>
                                  )}

                                  {/* Technical Details */}
                                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      Technical Details
                                    </h4>
                                    
                                    {/* Chains */}
                                    <div className="mb-4">
                                      <div className="text-xs font-medium text-slate-500 mb-2">Supported Chains</div>
                                      <div className="flex flex-wrap gap-2">
                                        {strategy.chains && strategy.chains.map((chain, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center px-2 py-1 text-xs font-medium border border-slate-200 rounded bg-white"
                                          >
                                            <span className="mr-1" style={{ color: chain.color }}>
                                              {chain.icon}
                                            </span>
                                            <span className="text-slate-700">{chain.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      <div>
                                        <div className="text-xs font-medium text-slate-500">Lockup Period</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                          {!strategy.lockup_period_days || strategy.lockup_period_days === 0 ? '—' : `${strategy.lockup_period_days} days`}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs font-medium text-slate-500">Risk Level</div>
                                        <div className={`text-sm font-semibold ${
                                          strategy.risk_level === 'low' ? 'text-green-600' :
                                          strategy.risk_level === 'medium' ? 'text-yellow-600' :
                                          'text-red-600'
                                        }`}>
                                          {riskLevelLabels[strategy.risk_level]}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Yield Sources */}
                                    <div>
                                      <div className="text-xs font-medium text-slate-500 mb-2">Yield Sources</div>
                                      <div className="space-y-1">
                                        {strategy.yield_sources.map((source, index) => (
                                          <div key={index} className="flex items-center text-xs text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3"></div>
                                            <span>{source.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    {strategy.url && (
                                      <a 
                                        href={strategy.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors"
                                      >
                                        Visit Platform →
                                      </a>
                                    )}
                                    {strategy.is_audited && strategy.audit_url && (
                                      <a 
                                        href={strategy.audit_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors"
                                      >
                                        Security Audit →
                                      </a>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Updated {new Date(strategy.last_updated_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredStrategies.length} of {strategies.length} strategies
      </div>
    </div>
  );
});

FlowChart.displayName = 'FlowChart';

export default FlowChart;