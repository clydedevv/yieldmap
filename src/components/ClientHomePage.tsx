'use client';

import { useState } from 'react';
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
    setSelectedStrategies([strategy]);
    setBreadcrumb(`${strategy.category} > ${strategy.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="btc-logo-lg mr-4">
              ₿
            </div>
            <h1 className="text-6xl font-bold gradient-text">
              BTC Yield Explorer
            </h1>
          </div>
          <p className="text-xl text-slate-700 font-medium max-w-4xl mx-auto leading-relaxed">
            Discover and analyze Bitcoin yield opportunities across native protocols, CEX liquid staking, on-chain strategies, and emerging L2 solutions.
          </p>
        </div>

        <div className="mb-12">
          <FlowChart onNodeClick={handleNodeClick} categoryNodes={categoryNodes} allStrategies={allStrategies} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {selectedStrategies.length > 0 && (
              <div className="mb-6">
                <nav className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-200">
                  <span className="text-sm text-slate-600 font-medium">
                    Showing results for: <strong className="text-slate-900">{breadcrumb}</strong>
                  </span>
                </nav>
              </div>
            )}
            
            <StrategyList 
              strategies={selectedStrategies.length > 0 ? selectedStrategies : []}
              title={selectedStrategies.length > 0 ? 'Selected Strategies' : 'All Strategies'}
            />
          </div>
          
          <div className="lg:col-span-1">
            <TopYieldSidebar onStrategyClick={handleStrategyClick} topStrategies={topStrategies} />
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              <span className="gradient-text">Explore Bitcoin Yield Opportunities</span>
            </h2>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              Navigate through different categories in the yield map above to discover strategies that match your risk profile and investment goals. Each strategy includes detailed entry guides, risk assessments, and yield source analysis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 