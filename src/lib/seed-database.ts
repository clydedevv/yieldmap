import { initDatabase, createStrategy, getAllStrategies } from './database';
import fs from 'fs';
import path from 'path';

export async function seedDatabase() {
  console.log('Initializing staging database...');
  initDatabase();
  
  // Check if we already have data
  const existingStrategies = getAllStrategies(false); // Get all including inactive
  if (existingStrategies.length > 0) {
    console.log(`Database already has ${existingStrategies.length} strategies. Skipping seed.`);
    return;
  }
  
  console.log('Seeding staging database...');
  
  // Try to copy from production database first
  const prodDbPath = '/opt/yieldmap/data/strategies.db';
  const stagingDbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'strategies.db');
  
  if (fs.existsSync(prodDbPath) && prodDbPath !== stagingDbPath) {
    try {
      console.log('Copying production database to staging...');
      fs.copyFileSync(prodDbPath, stagingDbPath);
      console.log('✓ Successfully copied production data to staging');
      return;
    } catch (error) {
      console.warn('Could not copy production database, using mock data instead:', error);
    }
  }
  
  // Fallback to mock data if production copy fails
  console.log('Using fallback mock data...');
  await seedMockData();
}

async function seedMockData() {
  try {
    // Import mock data dynamically to avoid build-time issues
    const mockData = await import('@/data/mockData');
    const mockStrategies = mockData.mockStrategies;
    
    mockStrategies.forEach((strategy, index: number) => {
      try {
        createStrategy({
          ...strategy,
          is_active: true
        });
        console.log(`✓ Seeded strategy ${index + 1}/${mockStrategies.length}: ${strategy.name}`);
      } catch (error) {
        console.error(`✗ Failed to seed strategy ${strategy.name}:`, error);
      }
    });
    
    console.log(`Successfully seeded ${mockStrategies.length} mock strategies!`);
  } catch (error) {
    console.error('Failed to load mock data:', error);
    console.log('Staging database initialized but empty');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
} 