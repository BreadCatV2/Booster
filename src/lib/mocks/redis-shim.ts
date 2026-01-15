/**
 * Local Redis shim
 * 
 * This file is aliased to replace src/lib/redis.ts in local dev mode.
 * Re-exports the mock Redis implementation.
 */

export { Redis, redis } from './upstash-redis-mock';
