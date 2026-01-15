/**
 * Mock Upstash Rate Limiter
 *
 * Always allows requests in local development
 */

export class Ratelimit {
    constructor(_config: unknown) { }

    static slidingWindow(_requests: number, _window: string) {
        return { type: 'slidingWindow' };
    }

    static fixedWindow(_requests: number, _window: string) {
        return { type: 'fixedWindow' };
    }

    static tokenBucket(_tokens: number, _interval: string, _maxTokens: number) {
        return { type: 'tokenBucket' };
    }

    async limit(_identifier: string) {
        return {
            success: true,
            limit: 1000,
            remaining: 999,
            reset: Date.now() + 60000,
            pending: Promise.resolve(),
        };
    }

    async blockUntilReady(_identifier: string, _timeout: number) {
        return {
            success: true,
            limit: 1000,
            remaining: 999,
            reset: Date.now() + 60000,
            pending: Promise.resolve(),
        };
    }
}

export default { Ratelimit };
