'use client';

import React from 'react';
import { Strategy } from '@/types/strategy';

interface StrategyListProps {
  strategies: Strategy[];
  title?: string;
}

export default function StrategyList({ strategies, title = 'Strategies' }: StrategyListProps) {
  const sortedStrategies = [...strategies].sort((a, b) => b.yield_percent - a.yield_percent);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <span className="icon-circle text-green-600"></span>;
      case 'medium': return <span className="icon-warning text-yellow-600"></span>;
      case 'high': return <span className="icon-warning text-red-600"></span>;
      default: return <span className="icon-circle text-gray-600"></span>;
    }
  };

  const getYieldSourceIcon = (icon: string) => {
    const iconMap: { [key: string]: React.JSX.Element } = {
      '🔶': <span className="icon-diamond text-orange-600"></span>,
      '⚡': <span className="icon-lightning text-yellow-600"></span>,
      '💰': <span className="text-green-600 font-bold">$</span>,
      '🔷': <span className="icon-diamond text-blue-600"></span>,
      '🔗': <span className="text-slate-600 font-bold">∞</span>,
      '🏦': <span className="text-slate-600 font-bold">█</span>,
      '🦄': <span className="text-purple-600 font-bold">◆</span>,
      '👻': <span className="text-indigo-600 font-bold">◊</span>,
      '🌊': <span className="text-blue-600 font-bold">~</span>,
      '🔺': <span className="text-red-600 font-bold">▲</span>,
    };
    return iconMap[icon] || <span className="icon-circle text-gray-600"></span>;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        {title}
      </h2>
      
      {sortedStrategies.length === 0 ? (
        <div className="text-center py-16">
          <div className="btc-logo-lg mb-6 mx-auto">
            ₿
          </div>
          <p className="text-slate-600 text-lg font-medium">No strategies found</p>
          <p className="text-slate-500 text-sm mt-2">Try exploring different categories in the yield map above</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover-lift-btc hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-slate-900 mb-2">{strategy.name}</h3>
                  <p className="text-slate-700 font-medium leading-relaxed">{strategy.description}</p>
                </div>
                <div className="flex items-center ml-6">
                  <span className="text-3xl font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    {strategy.yield_percent.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="mb-4 bg-orange-50/80 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-slate-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  How to deploy capital:
                </h4>
                <p className="text-sm text-slate-700 font-medium">{strategy.entry_guide}</p>
              </div>

              {/* Strategy Info Icons */}
              <div className="flex items-center space-x-4 mb-4">
                {/* Lock-up Period */}
                <div className="group relative">
                  <div className="flex items-center bg-slate-100 px-3 py-2 rounded-full cursor-help">
                    <span className="icon-lock text-slate-600"></span>
                    <span className="text-xs font-semibold text-slate-700">
                      {strategy.lockup_period_days ? `${strategy.lockup_period_days}d` : 'None'}
                    </span>
                  </div>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {strategy.lockup_period_days ? `${strategy.lockup_period_days} days lock-up period` : 'No lock-up period'}
                  </div>
                </div>

                {/* Audit Status */}
                <div className="group relative">
                  <a 
                    href={strategy.audit_url || '#'} 
                    className={`flex items-center px-3 py-2 rounded-full transition-colors ${
                      strategy.is_audited 
                        ? 'bg-green-100 hover:bg-green-200' 
                        : 'bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    <span className={`icon-shield ${strategy.is_audited ? 'text-green-600' : 'text-red-600'}`}></span>
                    <span className={`text-xs font-semibold ${
                      strategy.is_audited ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {strategy.is_audited ? 'Audited' : 'Unaudited'}
                    </span>
                  </a>
                </div>

                {/* Risk Level */}
                <div className={`flex items-center px-3 py-2 rounded-full ${getRiskColor(strategy.risk_level)}`}>
                  {getRiskIcon(strategy.risk_level)}
                  <span className="text-xs font-semibold capitalize">{strategy.risk_level} Risk</span>
                </div>
              </div>

              {/* Yield Sources */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-slate-900 mb-2">Yield Sources:</h4>
                <div className="flex items-center space-x-2 flex-wrap">
                  {strategy.yield_sources.map((source, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-orange-50 px-3 py-1 rounded-full border border-orange-200"
                    >
                      {getYieldSourceIcon(source.icon)}
                      <span className="text-xs font-medium text-orange-800 ml-1">{source.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full">
                  Updated: {strategy.last_updated_at.toLocaleDateString()}
                </span>
                {strategy.url && (
                  <a
                    href={strategy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 text-sm font-bold bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    Visit Protocol →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}