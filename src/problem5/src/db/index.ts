import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/database.sqlite';

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✓ Created data directory: ${dataDir}`);
}

const sqlite = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

function needsMigration(): boolean {
    try {
        // Check if resources table exists
        const result = sqlite.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='resources'"
        ).get();

        return !result; // true if table doesn't exist
    } catch (error) {
        return true; // Run migrations if we can't check
    }
}

export function runMigrations() {
    try {
        if (!needsMigration()) {
            console.log('✓ Database already initialized, skipping migrations');
            return;
        }

        console.log('Running migrations...');
        migrate(db, { migrationsFolder: './drizzle' });
        console.log('✓ Migrations completed successfully');
    } catch (error) {
        console.error('✗ Migration failed:', error);
        throw error;
    }
}

export function initDatabase() {
    console.log('\n=== Initializing Database ===');
    console.log(`✓ Database location: ${dbPath}`);

    try {
        runMigrations();
    } catch (error) {
        console.error('✗ Migration failed:', error);
        throw error;
    }

    try {
        sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_resources_status 
      ON resources(status);
      
      CREATE INDEX IF NOT EXISTS idx_resources_created_at 
      ON resources(created_at DESC);
    `);
        console.log('✓ Database indexes created');
    } catch (error) {
        console.error('✗ Failed to create indexes:', error);
    }

    console.log('=== Database Ready ===\n');
}