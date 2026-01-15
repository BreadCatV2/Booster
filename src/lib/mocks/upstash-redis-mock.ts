/**
 * Mock Upstash Redis
 *
 * Local file-based persistence for development
 */
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), '.local-redis.json');

// Ensure database file exists
if (!fs.existsSync(DB_PATH)) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify([]));
    } catch (e) {
        // Ignore write errors (might be readonly filesystem etc)
        console.error('[MockRedis] Failed to initialize DB file:', e);
    }
}

// In-memory cache backed by file
const globalForRedis = globalThis as unknown as {
    _mockRedisStore: Map<string, { value: unknown; expiry?: number }> | undefined;
};

if (!globalForRedis._mockRedisStore) {
    try {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        // Handle potentially empty file or invalid JSON logic
        const data = fileContent.trim() ? JSON.parse(fileContent) : [];
        globalForRedis._mockRedisStore = new Map(data);
    } catch (e) {
        console.warn('[MockRedis] Failed to read DB, starting fresh', e);
        globalForRedis._mockRedisStore = new Map();
    }
}
const store = globalForRedis._mockRedisStore!;

function saveDb() {
    try {
        const data = Array.from(store.entries());
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('[MockRedis] Save failed:', e);
    }
}

export class Redis {
    constructor(_config: unknown) {
        // Log only once per process restart, not every HMR
        const logged = (globalThis as any)._mockRedisLogged;
        if (!logged) {
            console.log(`[MockRedis] Initialized file-based mock (Items: ${store.size})`);
            console.log(`[MockRedis] Storage: ${DB_PATH}`);
            (globalThis as any)._mockRedisLogged = true;
        }
    }

    async get(key: string) {
        const item = store.get(key);
        if (!item) return null;
        if (item.expiry && Date.now() > item.expiry) {
            store.delete(key);
            saveDb(); // Prune expired
            return null;
        }
        return item.value;
    }

    async set(key: string, value: unknown, options?: { ex?: number; px?: number }) {
        let expiry: number | undefined;
        if (options?.ex) expiry = Date.now() + options.ex * 1000;
        if (options?.px) expiry = Date.now() + options.px;

        store.set(key, { value, expiry });
        saveDb();
        return 'OK';
    }

    async del(key: string) {
        const deleted = store.delete(key);
        if (deleted) saveDb();
        return deleted ? 1 : 0;
    }

    async hget(key: string, field: string) {
        const item = store.get(key);
        if (!item || typeof item.value !== 'object') return null;
        return (item.value as Record<string, unknown>)[field] ?? null;
    }

    async hset(key: string, fields: Record<string, unknown>) {
        const item = store.get(key);
        const currentVal = (item?.value as Record<string, unknown>) || {};
        store.set(key, { value: { ...currentVal, ...fields } });
        saveDb();
        return Object.keys(fields).length;
    }

    // Add other methods as needed by the app
    async incr(key: string) {
        const val = (store.get(key)?.value as number) || 0;
        const newVal = val + 1;
        store.set(key, { value: newVal });
        saveDb();
        return newVal;
    }

    async expire(key: string, seconds: number) {
        const item = store.get(key);
        if (item) {
            item.expiry = Date.now() + seconds * 1000;
            saveDb();
            return 1;
        }
        return 0;
    }

    async ttl(key: string) {
        const item = store.get(key);
        if (!item) return -2;
        if (!item.expiry) return -1;
        return Math.max(0, Math.floor((item.expiry - Date.now()) / 1000));
    }

    async sadd(key: string, ...members: unknown[]) {
        const item = store.get(key);
        const currentSet = new Set((item?.value as unknown[]) || []);
        members.forEach(m => currentSet.add(m));
        store.set(key, { value: Array.from(currentSet) });
        saveDb();
        return members.length;
    }

    async smembers(key: string) {
        const item = store.get(key);
        return (item?.value as unknown[]) || [];
    }

    async eval(_script: string, _keys: string[], _args: unknown[]) {
        return null;
    }

    async evalsha(_sha: string, _keys: string[], _args: unknown[]) {
        return null;
    }
}

export const redis = new Redis({});

export default Redis;
