'use client';

import { useState, useEffect } from 'react';
import { Strategy } from '@/types/strategy';
import { mockStrategies } from '@/data/mockData';

export default function AdminPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setStrategies(mockStrategies);
  }, []);

  const handleEdit = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsEditing(true);
  };

  const handleSave = (updatedStrategy: Strategy) => {
    setStrategies(prev => 
      prev.map(s => s.id === updatedStrategy.id ? updatedStrategy : s)
    );
    setIsEditing(false);
    setSelectedStrategy(null);
    // TODO: In real app, this would make an API call to update the database
    console.log('Strategy updated:', updatedStrategy);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedStrategy(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="btc-logo mr-4">
              ₿
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Admin Panel</h1>
          </div>
          <p className="text-slate-600">Update yield strategies and market data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy List */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 card-shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All Strategies</h2>
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{strategy.name}</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {strategy.yield_percent.toFixed(1)}%
                        </span>
                        <button
                          onClick={() => handleEdit(strategy)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{strategy.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>Risk: {strategy.risk_level}</span>
                      <span>•</span>
                      <span>Lock-up: {strategy.lockup_period_days || 0} days</span>
                      <span>•</span>
                      <span>Updated: {strategy.last_updated_at.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 card-shadow-lg sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {isEditing ? 'Edit Strategy' : 'Select a Strategy'}
              </h2>
              
              {isEditing && selectedStrategy ? (
                <StrategyEditForm 
                  strategy={selectedStrategy} 
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Click "Edit" on any strategy to modify its data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 card-shadow border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Database Migration Notice</h3>
          <p className="text-slate-600 mb-4">
            This admin interface currently updates mock data in memory. For production, you'll need to:
          </p>
          <ul className="text-slate-600 space-y-2 mb-4">
            <li>• Set up SQLite database with the schema from README.md</li>
            <li>• Create API endpoints in `/api/strategies/` for CRUD operations</li>
            <li>• Replace mock data with real database calls</li>
            <li>• Add authentication for admin access</li>
          </ul>
          <div className="flex items-center space-x-4">
            <a href="/api/strategies" className="text-orange-600 hover:text-orange-800 font-medium">
              View API Documentation →
            </a>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StrategyEditFormProps {
  strategy: Strategy;
  onSave: (strategy: Strategy) => void;
  onCancel: () => void;
}

function StrategyEditForm({ strategy, onSave, onCancel }: StrategyEditFormProps) {
  const [formData, setFormData] = useState<Strategy>(strategy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      last_updated_at: new Date()
    });
  };

  const handleChange = (field: keyof Strategy, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Strategy Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Yield Percentage
        </label>
        <input
          type="number"
          step="0.1"
          value={formData.yield_percent}
          onChange={(e) => handleChange('yield_percent', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Lock-up Period (days)
        </label>
        <input
          type="number"
          value={formData.lockup_period_days || 0}
          onChange={(e) => handleChange('lockup_period_days', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Risk Level
        </label>
        <select
          value={formData.risk_level}
          onChange={(e) => handleChange('risk_level', e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_audited"
          checked={formData.is_audited}
          onChange={(e) => handleChange('is_audited', e.target.checked)}
          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="is_audited" className="text-sm font-medium text-slate-900">
          Audited
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 