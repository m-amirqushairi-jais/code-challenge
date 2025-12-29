import { runMigrations } from './index.js';
import { config } from 'dotenv';

config();

try {
    console.log('Starting migration process...');
    runMigrations();
    console.log('Migration completed successfully!');
    process.exit(0);
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}