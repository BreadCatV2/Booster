/**
 * Local Development Mocks
 * 
 * This module provides mock implementations for external services
 * to enable fully offline local development.
 */

// Install fetch interceptor early
import './fetch-interceptor';

export const IS_LOCAL_DEV = process.env.USE_LOCAL_DEV === 'true';

// Mock user for local development
export const MOCK_USER = {
  id: 'local-dev-user-id',
  clerkId: 'clerk_local_dev_user',
  name: 'Dev User',
  username: 'devuser',
  email: 'dev@localhost',
  imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser',
  createdAt: new Date(),
  updatedAt: new Date(),
  about: 'Local development user',
  xp: 10000,
  boostPoints: 5000,
  rewardedAdsEnabled: false,
  verticalVideosEnabled: true,
  aiContentEnabled: true,
  accountType: 'personal' as const,
  dailyWatchCount: 0,
  lastDailyXpReset: new Date(),
} as const;

// Mock rate limiter that always allows
export const mockRateLimit = {
  limit: async (_identifier: string) => ({
    success: true,
    limit: 1000,
    remaining: 999,
    reset: Date.now() + 60000,
  }),
};

console.log(`[Mocks] Local development mode: ${IS_LOCAL_DEV ? 'ENABLED' : 'DISABLED'}`);
