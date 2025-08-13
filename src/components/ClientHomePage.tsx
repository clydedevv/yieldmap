'use client';

import { useRef } from 'react';
import FlowChart from '@/components/FlowChart';
import TopYieldSidebar from '@/components/TopYieldSidebar';
import { Strategy, CategoryNode } from '@/types/strategy';

interface ClientHomePageProps {
  categoryNodes: CategoryNode[];
  allStrategies: Strategy[];
  topStrategies: Strategy[];
}

export default function ClientHomePage({ categoryNodes, allStrategies, topStrategies }: ClientHomePageProps) {
  const flowChartRef = useRef<{ expandAndScrollToStrategy: (strategyId: string) => void }>(null);

  const handleStrategyClick = (strategy: Strategy) => {
    // Expand the strategy in the table and scroll to it
    if (flowChartRef.current) {
      flowChartRef.current.expandAndScrollToStrategy(strategy.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 gap-2 sm:gap-4">
            <div className="btc-logo">
              ₿
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text tracking-tight">
              BTC Yield Explorer
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-medium max-w-5xl mx-auto leading-relaxed tracking-wide px-4 sm:px-0">
            Discover and analyze Bitcoin yield opportunities across native protocols, CEX liquid staking, on-chain strategies, and emerging L2 solutions.
          </p>
        </div>

        {/* Top 5 Yields - Horizontal Layout */}
        <div className="mb-6 sm:mb-8">
          <TopYieldSidebar onStrategyClick={handleStrategyClick} topStrategies={topStrategies} />
        </div>

        {/* Main Table View - Full Width */}
        <div className="w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl card-shadow-btc p-4 sm:p-6 border border-orange-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
              <div className="btc-logo">
                ₿
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
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