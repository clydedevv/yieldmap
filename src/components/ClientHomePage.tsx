'use client';

import { useState, useRef } from 'react';
import FlowChart from '@/components/FlowChart';
import StrategyList from '@/components/StrategyList';
import TopYieldSidebar from '@/components/TopYieldSidebar';
import { Strategy, CategoryNode } from '@/types/strategy';

interface ClientHomePageProps {
  categoryNodes: CategoryNode[];
  allStrategies: Strategy[];
  topStrategies: Strategy[];
}

export default function ClientHomePage({ categoryNodes, allStrategies, topStrategies }: ClientHomePageProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string>('');
  const flowChartRef = useRef<{ expandAndScrollToStrategy: (strategyId: string) => void }>(null);

  const handleNodeClick = (category?: string, subcategory?: string, strategies?: Strategy[]) => {
    if (strategies) {
      setSelectedStrategies(strategies);
      let crumb = category || '';
      if (subcategory) {
        crumb += ` > ${subcategory}`;
      }
      setBreadcrumb(crumb);
    }
  };

  const handleStrategyClick = (strategy: Strategy) => {
    // Expand the strategy in the table and scroll to it
    if (flowChartRef.current) {
      flowChartRef.current.expandAndScrollToStrategy(strategy.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="btc-logo mr-4">
              ₿
            </div>
            <h1 className="text-6xl font-bold gradient-text">
              BTC Yield Explorer
            </h1>
          </div>
                    <p className="text-xl text-slate-700 font-medium max-w-4xl mx-auto leading-relaxed">
            Discover and analyze Bitcoin yield opportunities across native protocols, CEX liquid staking, on-chain strategies, and emerging L2 solutions.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-800">Live yield data</span>
            </div>
          </div>
        </div>

        {/* Top 5 Yields - Horizontal Layout */}
        <div className="mb-8">
          <TopYieldSidebar onStrategyClick={handleStrategyClick} topStrategies={topStrategies} />
        </div>

        {/* Main Table View - Full Width */}
        <div className="w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-shadow-btc p-6 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="btc-logo mr-3">
                ₿
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                <span className="gradient-text">All Bitcoin Yield Strategies</span>
              </h2>
            </div>
            <FlowChart ref={flowChartRef} onStrategySelect={handleStrategyClick} categoryNodes={categoryNodes} allStrategies={allStrategies} />
          </div>
        </div>

        <footer className="mt-20 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 card-shadow-lg border border-slate-200">
            <div className="flex items-center justify-center mb-4">
              <div className="btc-logo mr-3">
                ₿
              </div>
              <h3 className="text-xl font-bold text-slate-900">BTC Yield Explorer</h3>
            </div>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              Eliminating alpha information asymmetry • Database-driven
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
} 