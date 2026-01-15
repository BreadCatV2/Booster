/**
 * Clerk Server Shim for Local Development
 *
 * This module re-exports either real Clerk server functions or mock implementations
 * based on the USE_LOCAL_DEV environment variable.
 *
 * Usage: Instead of importing from '@clerk/nextjs/server', import from '@/lib/mocks/clerk-server-shim'
 */

import { mockAuth, mockCurrentUser } from './auth-mock';

const IS_LOCAL_DEV = process.env.USE_LOCAL_DEV === 'true';

// Server-side functions
export const auth = IS_LOCAL_DEV
  ? mockAuth
  : require('@clerk/nextjs/server').auth;

export const currentUser = IS_LOCAL_DEV
  ? mockCurrentUser
  : require('@clerk/nextjs/server').currentUser;

// Re-export middleware-related items (these will be handled separately in middleware.ts)
export const clerkMiddleware = IS_LOCAL_DEV
  ? () => () => { } // No-op for local dev
  : require('@clerk/nextjs/server').clerkMiddleware;

export const createRouteMatcher = IS_LOCAL_DEV
  ? () => () => false // No-op for local dev
  : require('@clerk/nextjs/server').createRouteMatcher;
