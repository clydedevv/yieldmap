'use client';

import { useState } from 'react';
import FlowChart from '@/components/FlowChart';
import StrategyList from '@/components/StrategyList';
import TopYieldSidebar from '@/components/TopYieldSidebar';
import { Strategy } from '@/types/strategy';
import { mockStrategies } from '@/data/mockData';

export default function Home() {
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string>('');

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategies([strategy]);
    setBreadcrumb(`${strategy.category} > ${strategy.name}`);
  };

  // Get top 5 strategies by yield
  const topStrategies = mockStrategies.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="btc-logo btc-logo-lg mr-4">
              ₿
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight">
              BTC Yield Explorer
            </h1>
          </div>
          <p className="text-slate-700 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            Discover and explore Bitcoin yield opportunities across decentralized finance protocols
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-800">Live yield data</span>
            </div>
            <a 
              href="/admin" 
              className="inline-flex items-center bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-full transition-colors"
            >
              <span className="text-sm font-semibold text-blue-800">Update Yields</span>
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-shadow-btc p-6 border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="btc-logo mr-3">
                  ₿
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  <span className="gradient-text">Navigate Yield Opportunities</span>
                </h2>
              </div>
              <FlowChart onStrategySelect={handleStrategyClick} />
            </div>



            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 card-shadow-btc border border-orange-100">
              <StrategyList 
                strategies={selectedStrategies}
                title={breadcrumb ? `${breadcrumb} Strategies` : 'All Strategies'}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <TopYieldSidebar onStrategyClick={handleStrategyClick} topStrategies={topStrategies} />
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
              Eliminating alpha information asymmetry • Data updated manually • 
              <a href="/admin" className="text-orange-600 hover:text-orange-800 font-bold hover:underline ml-1 transition-colors">
                Submit yield updates
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}