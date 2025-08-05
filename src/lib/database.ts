import Database from 'better-sqlite3';
import path from 'path';
import { Strategy, YieldSource, Chain } from '@/types/strategy';

const dbPath = path.join(process.cwd(), 'data', 'strategies.db');
let db: Database.Database;

// Initialize database
export function initDatabase() {
  try {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    
    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS strategies (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        subcategory TEXT,
        name TEXT NOT NULL,
        yield_percent REAL NOT NULL,
        description TEXT NOT NULL,
        entry_guide TEXT NOT NULL,
        notes TEXT,
        url TEXT,
        lockup_period_days INTEGER,
        is_audited BOOLEAN DEFAULT 0,
        audit_url TEXT,
        risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')) NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS yield_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        strategy_id TEXT NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (strategy_id) REFERENCES strategies (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS chains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        strategy_id TEXT NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        FOREIGN KEY (strategy_id) REFERENCES strategies (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_strategies_category ON strategies(category);
      CREATE INDEX IF NOT EXISTS idx_strategies_active ON strategies(is_active);
      CREATE INDEX IF NOT EXISTS idx_yield_sources_strategy ON yield_sources(strategy_id);
      CREATE INDEX IF NOT EXISTS idx_chains_strategy ON chains(strategy_id);
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    db = initDatabase();
  }
  return db;
}

// CRUD Operations
export function getAllStrategies(activeOnly: boolean = true): Strategy[] {
  const database = getDatabase();
  
  const query = activeOnly 
    ? `SELECT * FROM strategies WHERE is_active = 1 ORDER BY yield_percent DESC`
    : `SELECT * FROM strategies ORDER BY yield_percent DESC`;
  
  const strategies = database.prepare(query).all() as any[];
  
  // Get yield sources for each strategy
  const getYieldSources = database.prepare(`
    SELECT name, icon, description FROM yield_sources WHERE strategy_id = ?
  `);
  
  // Get chains for each strategy
  const getChains = database.prepare(`
    SELECT name, icon, color FROM chains WHERE strategy_id = ?
  `);
  
  return strategies.map(strategy => ({
    ...strategy,
    last_updated_at: new Date(strategy.last_updated_at),
    is_audited: Boolean(strategy.is_audited),
    yield_sources: getYieldSources.all(strategy.id) as YieldSource[],
    chains: getChains.all(strategy.id) as Chain[]
  }));
}

export function getStrategyById(id: string): Strategy | null {
  const database = getDatabase();
  
  const strategy = database.prepare(`
    SELECT * FROM strategies WHERE id = ?
  `).get(id) as any;
  
  if (!strategy) return null;
  
  const yieldSources = database.prepare(`
    SELECT name, icon, description FROM yield_sources WHERE strategy_id = ?
  `).all(id) as YieldSource[];
  
  const chains = database.prepare(`
    SELECT name, icon, color FROM chains WHERE strategy_id = ?
  `).all(id) as Chain[];
  
  return {
    ...strategy,
    last_updated_at: new Date(strategy.last_updated_at),
    is_audited: Boolean(strategy.is_audited),
    yield_sources: yieldSources,
    chains: chains
  };
}

export function createStrategy(strategy: Omit<Strategy, 'last_updated_at'> & { is_active?: boolean }): Strategy {
  const database = getDatabase();
  
  const transaction = database.transaction((strategyData: any) => {
    // Insert strategy
    database.prepare(`
      INSERT INTO strategies (
        id, category, subcategory, name, yield_percent, description, 
        entry_guide, notes, url, lockup_period_days, is_audited, audit_url, 
        risk_level, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      strategyData.id,
      strategyData.category,
      strategyData.subcategory || null,
      strategyData.name,
      strategyData.yield_percent,
      strategyData.description,
      strategyData.entry_guide,
      strategyData.notes || null,
      strategyData.url || null,
      strategyData.lockup_period_days || null,
      strategyData.is_audited ? 1 : 0,
      strategyData.audit_url || null,
      strategyData.risk_level,
      strategyData.is_active !== false ? 1 : 0
    );
    
    // Insert yield sources
    const insertYieldSource = database.prepare(`
      INSERT INTO yield_sources (strategy_id, name, icon, description)
      VALUES (?, ?, ?, ?)
    `);
    
    strategyData.yield_sources.forEach((source: YieldSource) => {
      insertYieldSource.run(
        strategyData.id,
        source.name,
        source.icon,
        source.description || null
      );
    });
    
    // Insert chains
    const insertChain = database.prepare(`
      INSERT INTO chains (strategy_id, name, icon, color)
      VALUES (?, ?, ?, ?)
    `);
    
    strategyData.chains.forEach((chain: Chain) => {
      insertChain.run(
        strategyData.id,
        chain.name,
        chain.icon,
        chain.color
      );
    });
  });
  
  transaction(strategy);
  return getStrategyById(strategy.id)!;
}

export function updateStrategy(id: string, updates: Partial<Strategy> & { is_active?: boolean }): Strategy | null {
  const database = getDatabase();
  
  const transaction = database.transaction((strategyId: string, strategyUpdates: any) => {
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    if (strategyUpdates.category !== undefined) {
      fields.push('category = ?');
      values.push(strategyUpdates.category);
    }
    if (strategyUpdates.subcategory !== undefined) {
      fields.push('subcategory = ?');
      values.push(strategyUpdates.subcategory);
    }
    if (strategyUpdates.name !== undefined) {
      fields.push('name = ?');
      values.push(strategyUpdates.name);
    }
    if (strategyUpdates.yield_percent !== undefined) {
      fields.push('yield_percent = ?');
      values.push(strategyUpdates.yield_percent);
    }
    if (strategyUpdates.description !== undefined) {
      fields.push('description = ?');
      values.push(strategyUpdates.description);
    }
    if (strategyUpdates.entry_guide !== undefined) {
      fields.push('entry_guide = ?');
      values.push(strategyUpdates.entry_guide);
    }
    if (strategyUpdates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(strategyUpdates.notes);
    }
    if (strategyUpdates.url !== undefined) {
      fields.push('url = ?');
      values.push(strategyUpdates.url);
    }
    if (strategyUpdates.lockup_period_days !== undefined) {
      fields.push('lockup_period_days = ?');
      values.push(strategyUpdates.lockup_period_days);
    }
    if (strategyUpdates.is_audited !== undefined) {
      fields.push('is_audited = ?');
      values.push(strategyUpdates.is_audited ? 1 : 0);
    }
    if (strategyUpdates.audit_url !== undefined) {
      fields.push('audit_url = ?');
      values.push(strategyUpdates.audit_url);
    }
    if (strategyUpdates.risk_level !== undefined) {
      fields.push('risk_level = ?');
      values.push(strategyUpdates.risk_level);
    }
    if (strategyUpdates.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(strategyUpdates.is_active ? 1 : 0);
    }
    
    if (fields.length > 0) {
      fields.push('last_updated_at = CURRENT_TIMESTAMP');
      values.push(strategyId);
      
      database.prepare(`
        UPDATE strategies SET ${fields.join(', ')} WHERE id = ?
      `).run(...values);
    }
    
    // Update yield sources if provided
    if (strategyUpdates.yield_sources) {
      // Delete existing yield sources
      database.prepare('DELETE FROM yield_sources WHERE strategy_id = ?').run(strategyId);
      
      // Insert new yield sources
      const insertYieldSource = database.prepare(`
        INSERT INTO yield_sources (strategy_id, name, icon, description)
        VALUES (?, ?, ?, ?)
      `);
      
      strategyUpdates.yield_sources.forEach((source: YieldSource) => {
        insertYieldSource.run(
          strategyId,
          source.name,
          source.icon,
          source.description || null
        );
      });
    }
    
    // Update chains if provided
    if (strategyUpdates.chains) {
      // Delete existing chains
      database.prepare('DELETE FROM chains WHERE strategy_id = ?').run(strategyId);
      
      // Insert new chains
      const insertChain = database.prepare(`
        INSERT INTO chains (strategy_id, name, icon, color)
        VALUES (?, ?, ?, ?)
      `);
      
      strategyUpdates.chains.forEach((chain: Chain) => {
        insertChain.run(
          strategyId,
          chain.name,
          chain.icon,
          chain.color
        );
      });
    }
  });
  
  transaction(id, updates);
  return getStrategyById(id);
}

export function deleteStrategy(id: string): boolean {
  const database = getDatabase();
  
  const result = database.prepare('DELETE FROM strategies WHERE id = ?').run(id);
  return result.changes > 0;
}

export function toggleStrategyVisibility(id: string): Strategy | null {
  const database = getDatabase();
  
  const strategy = getStrategyById(id);
  if (!strategy) return null;
  
  const newActiveState = !(strategy as any).is_active;
  database.prepare('UPDATE strategies SET is_active = ?, last_updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newActiveState ? 1 : 0, id);
  
  return getStrategyById(id);
}

export function getTopStrategies(limit: number = 5): Strategy[] {
  return getAllStrategies(true).slice(0, limit);
} 