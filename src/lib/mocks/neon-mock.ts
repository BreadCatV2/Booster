/**
 * Mock for @neondatabase/serverless
 * 
 * Redirects to standard pg driver for local PostgreSQL.
 * This allows the same code to work with both Neon (production) 
 * and local PostgreSQL (development).
 */

import { Pool as PgPool, PoolClient, QueryResult, QueryResultRow } from 'pg';

// Re-export Pool from pg, but with Neon-compatible interface
export class Pool extends PgPool {
    constructor(config: { connectionString?: string }) {
        super(config);
        console.log('[MockNeon] Using local PostgreSQL via pg driver');
    }
}

// Mock neonConfig (used by drizzle-orm)
export const neonConfig = {
    fetchConnectionCache: true,
    webSocketConstructor: undefined,
    pipelineConnect: 'password' as const,
    coalesceWrites: true,
    forceDisablePgSSL: false,
    useSecureWebSocket: true,
    subtls: undefined,
    rootCerts: '',
    pipelineTLS: true,
    wsProxy: undefined,
};

// Mock Client class
export class Client {
    constructor(_config: unknown) { }
    async connect() { return this; }
    async query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<T>> {
        throw new Error('[MockNeon] Client.query not implemented - use Pool instead');
    }
    async end() { }
}

// Re-export neon function that returns a query function
export function neon(connectionString: string) {
    const pool = new PgPool({ connectionString });

    return async function sql<T extends QueryResultRow = QueryResultRow>(
        strings: TemplateStringsArray,
        ...values: unknown[]
    ): Promise<T[]> {
        // Build the query from template literal
        let query = '';
        strings.forEach((str, i) => {
            query += str;
            if (i < values.length) {
                query += `$${i + 1}`;
            }
        });

        const result = await pool.query<T>(query, values);
        return result.rows;
    };
}

// Re-export types for compatibility
export type { PoolClient, QueryResult };

export default { Pool, neon, neonConfig, Client };
