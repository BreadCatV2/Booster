/**
 * Database shim for local development
 *
 * This file replaces src/db/index.ts via webpack alias.
 * Uses standard pg driver instead of Neon serverless.
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';

// Use global to preserve connection pool across HMR
const globalForDb = globalThis as unknown as {
    _mockPool: Pool | undefined;
};

let pool: Pool;

if (!globalForDb._mockPool) {
    console.log('[MockDB] Using local PostgreSQL via pg driver');
    console.log('[MockDB] DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

    globalForDb._mockPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
    });

    // Test connection on startup
    globalForDb._mockPool.query('SELECT 1').then(() => {
        console.log('[MockDB] Connection successful');
    }).catch((err) => {
        console.error('[MockDB] Connection failed:', err.message);
    });
}

pool = globalForDb._mockPool;

export const db = drizzle(pool, { schema });
