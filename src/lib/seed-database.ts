import { initDatabase, createStrategy } from './database';
import { mockStrategies } from '@/data/mockData';

export function seedDatabase() {
  console.log('Initializing database...');
  initDatabase();
  
  console.log('Seeding database with mock data...');
  
  // Clear existing data and seed with mock strategies
  mockStrategies.forEach((strategy, index) => {
    try {
      createStrategy({
        ...strategy,
        is_active: true // All initial strategies are active by default
      });
      console.log(`✓ Seeded strategy ${index + 1}/${mockStrategies.length}: ${strategy.name}`);
    } catch (error) {
      console.error(`✗ Failed to seed strategy ${strategy.name}:`, error);
    }
  });
  
  console.log(`Successfully seeded ${mockStrategies.length} strategies!`);
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
} 