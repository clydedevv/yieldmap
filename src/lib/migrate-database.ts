import { getDatabase } from './database';

export function migrateDatabase() {
  const db = getDatabase();
  
  try {
    // Check if columns already exist
    const tableInfo = db.prepare("PRAGMA table_info(strategies)").all();
    const hasMinYield = (tableInfo as { name: string }[]).some(col => col.name === 'min_yield_percent');
    const hasMaxYield = (tableInfo as { name: string }[]).some(col => col.name === 'max_yield_percent');
    
    if (!hasMinYield) {
      console.log('Adding min_yield_percent column...');
      db.exec('ALTER TABLE strategies ADD COLUMN min_yield_percent REAL');
    }
    
    if (!hasMaxYield) {
      console.log('Adding max_yield_percent column...');
      db.exec('ALTER TABLE strategies ADD COLUMN max_yield_percent REAL');
    }
    
    if (!hasMinYield || !hasMaxYield) {
      console.log('Database migration completed successfully');
    } else {
      console.log('Database already up to date');
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDatabase();
} 