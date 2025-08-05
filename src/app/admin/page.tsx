'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Strategy } from '@/types/strategy';
import { StrategyAPI } from '@/lib/api';

export default function AdminPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStrategies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading strategies, showActiveOnly:', showActiveOnly, 'calling API with:', !showActiveOnly);
      const data = await StrategyAPI.getAllStrategies(!showActiveOnly); // Invert logic: false = show all
      console.log('Loaded strategies:', data.length);
      setStrategies(data);
    } catch (err) {
      console.error('Error loading strategies:', err);
      setError(`Failed to load strategies: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [showActiveOnly]);

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  const handleEdit = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedStrategy(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleSave = async (updatedStrategy: Strategy) => {
    try {
      if (isCreating) {
        await StrategyAPI.createStrategy(updatedStrategy);
      } else {
        await StrategyAPI.updateStrategy(updatedStrategy.id, updatedStrategy);
      }
      await loadStrategies();
      setIsEditing(false);
      setIsCreating(false);
      setSelectedStrategy(null);
    } catch (err) {
      setError('Failed to save strategy');
      console.error(err);
    }
  };

  const handleToggleVisibility = async (strategy: Strategy) => {
    try {
      await StrategyAPI.toggleStrategyVisibility(strategy.id);
      await loadStrategies();
    } catch (err) {
      setError('Failed to toggle strategy visibility');
      console.error(err);
    }
  };

  const handleDelete = async (strategy: Strategy) => {
    if (confirm(`Are you sure you want to delete "${strategy.name}"?`)) {
      try {
        await StrategyAPI.deleteStrategy(strategy.id);
        await loadStrategies();
      } catch (err) {
        setError('Failed to delete strategy');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedStrategy(null);
  };

  const getStrategyStatus = (strategy: Strategy & { is_active?: boolean }) => {
    return strategy.is_active ? 'Active' : 'Hidden';
  };

  const getStatusColor = (strategy: Strategy & { is_active?: boolean }) => {
    return strategy.is_active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="btc-logo text-6xl mb-4">₿</div>
          <p className="text-slate-600">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="btc-logo mr-4">₿</div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Admin Panel</h1>
                <p className="text-slate-600">Manage yield strategies and visibility</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreate}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                + Add Strategy
              </button>
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Main App
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button onClick={() => setError(null)} className="float-right font-bold">×</button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 card-shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-slate-900">Filter:</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-slate-700">Show active strategies only</span>
                </label>
              </div>
              <div className="text-sm text-slate-600">
                Total strategies: {strategies.length}
              </div>
            </div>
          </div>
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
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-lg text-slate-900">{strategy.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(strategy)}`}>
                          {getStrategyStatus(strategy)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {strategy.yield_percent.toFixed(1)}%
                        </span>
                        <button
                          onClick={() => handleToggleVisibility(strategy)}
                          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                            (strategy as Strategy & { is_active?: boolean }).is_active 
                              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {(strategy as Strategy & { is_active?: boolean }).is_active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => handleEdit(strategy)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(strategy)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{strategy.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>Risk: {strategy.risk_level}</span>
                      <span>•</span>
                      <span>Lock-up: {strategy.lockup_period_days || 0} days</span>
                      <span>•</span>
                      <span>Updated: {new Date(strategy.last_updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit/Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 card-shadow-lg sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {isCreating ? 'Create New Strategy' : isEditing ? 'Edit Strategy' : 'Select a Strategy'}
              </h2>
              
              {(isEditing && selectedStrategy) || isCreating ? (
                <StrategyEditForm 
                  strategy={selectedStrategy || {
                    id: '',
                    category: 'native_btc',
                    name: '',
                    yield_percent: 0,
                    min_yield_percent: undefined,
                    max_yield_percent: undefined,
                    description: '',
                    entry_guide: '',
                    notes: '',
                    risk_level: 'medium',
                    is_audited: false,
                    yield_sources: [],
                    chains: [],
                    lockup_period_days: 0,
                    last_updated_at: new Date()
                  } as Strategy}
                  isCreating={isCreating}
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
                  <p className="text-slate-600 mb-4">Click &ldquo;Edit&rdquo; on any strategy to modify it, or click &ldquo;Add Strategy&rdquo; to create a new one.</p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Strategy Visibility</h4>
                    <p className="text-sm text-orange-700">Use &ldquo;Show/Hide&rdquo; buttons to control which strategies appear on the main site.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 card-shadow border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">✅ Database Integration Complete</h3>
          <p className="text-slate-600 mb-4">
            This admin interface is now connected to the SQLite database with full CRUD operations:
          </p>
          <ul className="text-slate-600 space-y-2 mb-4">
            <li>✅ SQLite database with proper schema</li>
            <li>✅ API endpoints for all CRUD operations</li>
            <li>✅ Strategy visibility management (show/hide)</li>
            <li>✅ Real-time data updates</li>
            <li>✅ Create, edit, and delete strategies</li>
          </ul>
          <div className="flex items-center space-x-4">
            <Link href="/api/strategies" className="text-orange-600 hover:text-orange-800 font-medium">
              View API Endpoints →
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Main App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StrategyEditFormProps {
  strategy: Strategy;
  isCreating?: boolean;
  onSave: (strategy: Strategy) => void;
  onCancel: () => void;
}

function StrategyEditForm({ strategy, isCreating = false, onSave, onCancel }: StrategyEditFormProps) {
  const [formData, setFormData] = useState<Strategy>({
    ...strategy,
    chains: strategy.chains || [],
    notes: strategy.notes || '',
    yield_sources: strategy.yield_sources || [],
    lockup_period_days: strategy.lockup_period_days || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      last_updated_at: new Date()
    });
  };

  const handleChange = (field: keyof Strategy, value: string | number | boolean | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addYieldSource = () => {
    setFormData(prev => ({
      ...prev,
      yield_sources: [...prev.yield_sources, { name: '', icon: '💰', description: '' }]
    }));
  };

  const removeYieldSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      yield_sources: prev.yield_sources.filter((_, i) => i !== index)
    }));
  };

  const updateYieldSource = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      yield_sources: prev.yield_sources.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    }));
  };

  const addChain = () => {
    setFormData(prev => ({
      ...prev,
      chains: [...prev.chains, { name: '', icon: '🔗', color: '#6366f1' }]
    }));
  };

  const removeChain = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chains: prev.chains.filter((_, i) => i !== index)
    }));
  };

  const updateChain = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      chains: prev.chains.map((chain, i) => 
        i === index ? { ...chain, [field]: value } : chain
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Strategy Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          required
        >
          <option value="native_btc">Native BTC</option>
          <option value="cex_lst">CEX LST</option>
          <option value="onchain_lst">On-chain LST</option>
          <option value="babylon_core">Babylon Core</option>
          <option value="l2_strategies">L2 Strategies</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Subcategory (optional)
        </label>
        <select
          value={formData.subcategory || ''}
          onChange={(e) => handleChange('subcategory', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
        >
          <option value="">None</option>
          <option value="dex_lp">DEX LP</option>
          <option value="lending_lp">Lending LP</option>
          <option value="perp_dex_lp">Perp DEX LP</option>
          <option value="crosschain_lp">Cross-chain LP</option>
          <option value="alt_lp">Alternative LP</option>
        </select>
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
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Min Yield % (Optional)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.min_yield_percent || ''}
            onChange={(e) => handleChange('min_yield_percent', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
            placeholder="e.g., 5.0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Max Yield % (Optional)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.max_yield_percent || ''}
            onChange={(e) => handleChange('max_yield_percent', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
            placeholder="e.g., 8.0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Entry Guide
        </label>
        <textarea
          value={formData.entry_guide}
          onChange={(e) => handleChange('entry_guide', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Research Notes (optional)
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          rows={2}
          placeholder="Add research notes about this strategy..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Protocol URL (optional)
        </label>
        <input
          type="url"
          value={formData.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Lock-up Period (days)
        </label>
        <input
          type="number"
          value={formData.lockup_period_days || 0}
          onChange={(e) => handleChange('lockup_period_days', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Risk Level
        </label>
        <select
          value={formData.risk_level}
          onChange={(e) => handleChange('risk_level', e.target.value as 'low' | 'medium' | 'high')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
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

      {formData.is_audited && (
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Audit URL
          </label>
          <input
            type="url"
            value={formData.audit_url || ''}
            onChange={(e) => handleChange('audit_url', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium bg-white"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-900">
            Supported Chains
          </label>
          <button
            type="button"
            onClick={addChain}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            + Add Chain
          </button>
        </div>
        {formData.chains.map((chain, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Chain Name (e.g., Ethereum)"
              value={chain.name}
              onChange={(e) => updateChain(index, 'name', e.target.value)}
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-medium bg-white"
            />
            <input
              type="text"
              placeholder="Icon (e.g., ⟡)"
              value={chain.icon}
              onChange={(e) => updateChain(index, 'icon', e.target.value)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-medium bg-white"
            />
            <input
              type="color"
              value={chain.color}
              onChange={(e) => updateChain(index, 'color', e.target.value)}
              className="w-12 h-8 border border-slate-300 rounded"
            />
            <button
              type="button"
              onClick={() => removeChain(index)}
              className="text-red-600 hover:text-red-800 px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-900">
            Yield Sources
          </label>
          <button
            type="button"
            onClick={addYieldSource}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            + Add Source
          </button>
        </div>
        {formData.yield_sources.map((source, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Source Name"
              value={source.name}
              onChange={(e) => updateYieldSource(index, 'name', e.target.value)}
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-medium bg-white"
            />
            <input
              type="text"
              placeholder="Icon"
              value={source.icon}
              onChange={(e) => updateYieldSource(index, 'icon', e.target.value)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-medium bg-white"
            />
            <button
              type="button"
              onClick={() => removeYieldSource(index)}
              className="text-red-600 hover:text-red-800 px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          {isCreating ? 'Create Strategy' : 'Save Changes'}
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