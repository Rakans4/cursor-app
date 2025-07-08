import pool from './server/database/config.js';
import { execSync } from 'child_process';

const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Run migrations
    console.log('Running migrations...');
    execSync('npm run db:migrate', { stdio: 'inherit' });
    
    // Run seed data
    console.log('Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase(); 