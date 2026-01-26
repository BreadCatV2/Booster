import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schema";

// Debug: log when the real Neon db module is loaded (should be bypassed in local dev)
console.log('[RealDB] Loaded src/db/index.ts (Neon driver)');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });