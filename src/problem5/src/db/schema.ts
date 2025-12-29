import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const resources = sqliteTable('resources', {
    id: integer('id').primaryKey({ autoIncrement: true }),

    name: text('name').notNull(),

    description: text('description'),

    status: text('status', { enum: ['active', 'inactive'] })
        .notNull()
        .default('active'),

    createdAt: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: text('updated_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;