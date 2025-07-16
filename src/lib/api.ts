import { Strategy } from '@/types/strategy';

const API_BASE = '/api';

export class StrategyAPI {
  static async getAllStrategies(activeOnly: boolean = true): Promise<Strategy[]> {
    const response = await fetch(`${API_BASE}/strategies?active=${activeOnly}`);
    if (!response.ok) {
      throw new Error('Failed to fetch strategies');
    }
    const data = await response.json();
    return data.strategies;
  }

  static async getStrategy(id: string): Promise<Strategy> {
    const response = await fetch(`${API_BASE}/strategies/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch strategy');
    }
    const data = await response.json();
    return data.strategy;
  }

  static async createStrategy(strategy: Omit<Strategy, 'id' | 'last_updated_at'>): Promise<Strategy> {
    const response = await fetch(`${API_BASE}/strategies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(strategy),
    });
    if (!response.ok) {
      throw new Error('Failed to create strategy');
    }
    const data = await response.json();
    return data.strategy;
  }

  static async updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy> {
    const response = await fetch(`${API_BASE}/strategies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update strategy');
    }
    const data = await response.json();
    return data.strategy;
  }

  static async deleteStrategy(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/strategies/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete strategy');
    }
  }

  static async toggleStrategyVisibility(id: string): Promise<Strategy> {
    const response = await fetch(`${API_BASE}/strategies/${id}/toggle`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle strategy visibility');
    }
    const data = await response.json();
    return data.strategy;
  }

  static async getTopStrategies(limit: number = 5): Promise<Strategy[]> {
    const strategies = await this.getAllStrategies(true);
    return strategies.slice(0, limit);
  }
} 