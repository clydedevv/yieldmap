'use client';

import React from 'react';
import { Strategy } from '@/types/strategy';

// Helper function to format yield display
const formatYieldDisplay = (strategy: Strategy): string => {
  if (strategy.min_yield_percent && strategy.max_yield_percent) {
    return `${strategy.min_yield_percent}% - ${strategy.max_yield_percent}%`;
  }
  return `${strategy.yield_percent.toFixed(1)}%`;
};

interface TopYieldSidebarProps {
  onStrategyClick: (strategy: Strategy) => void;
  topStrategies: Strategy[];
}

export default function TopYieldSidebar({ onStrategyClick, topStrategies }: TopYieldSidebarProps) {

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-shadow-btc p-6 border border-orange-100">
      <div className="flex items-center mb-6">
        <div className="btc-logo mr-3">
          ₿
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
          <span className="gradient-text">Top 5 Yields</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {topStrategies.map((strategy, index) => (
          <div
            key={strategy.id}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 hover-lift-btc cursor-pointer transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/50"
            onClick={() => onStrategyClick(strategy)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full">
                #{index + 1}
              </span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {formatYieldDisplay(strategy)}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug line-clamp-2">
              {strategy.name}
            </h3>
            
            <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
              {strategy.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-2xl border border-orange-200">
          <p className="text-sm text-slate-700 font-semibold">
            Click any strategy to view details
          </p>
        </div>
      </div>
    </div>
  );
}