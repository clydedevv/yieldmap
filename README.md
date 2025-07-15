This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## BTC Yield Explorer

A professional Bitcoin yield opportunity explorer with interactive flow charts and comprehensive strategy analysis.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Moving to SQLite Database for MVP

### Current Implementation
Currently using mock data in `src/data/mockData.ts` - this is fine for development but should be replaced with a lightweight database for production.

### Recommended Database Schema

```sql
-- Strategies table
CREATE TABLE strategies (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  name TEXT NOT NULL,
  yield_percent REAL NOT NULL,
  description TEXT NOT NULL,
  entry_guide TEXT NOT NULL,
  lockup_period_days INTEGER,
  is_audited BOOLEAN DEFAULT 0,
  audit_url TEXT,
  risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')) NOT NULL,
  url TEXT,
  last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Yield sources table
CREATE TABLE yield_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  strategy_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (strategy_id) REFERENCES strategies(id)
);

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category_type TEXT NOT NULL
);

-- Subcategories table
CREATE TABLE subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  label TEXT NOT NULL,
  subcategory_type TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Implementation Steps

1. **Install SQLite dependencies**:
```bash
npm install sqlite3 better-sqlite3
npm install --save-dev @types/better-sqlite3
```

2. **Create database utilities**:
```typescript
// src/lib/database.ts
import Database from 'better-sqlite3';

const db = new Database('btc-yield-explorer.db');

export const getStrategies = () => {
  return db.prepare('SELECT * FROM strategies').all();
};

export const getYieldSources = (strategyId: string) => {
  return db.prepare('SELECT * FROM yield_sources WHERE strategy_id = ?').all(strategyId);
};

export const updateStrategy = (id: string, updates: Partial<Strategy>) => {
  // Implementation for updating strategy data
};

export const addStrategy = (strategy: Strategy) => {
  // Implementation for adding new strategy
};
```

3. **Create admin interface** for updating yield data:
   - Simple form to add/edit strategies
   - Upload CSV functionality for bulk updates
   - Real-time yield data integration

4. **Benefits of SQLite for MVP**:
   - Zero-config database
   - File-based (easy backup/deployment)
   - Full SQL support
   - Excellent performance for read-heavy workloads
   - Easy migration path to PostgreSQL later

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
