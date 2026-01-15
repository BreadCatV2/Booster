/**
 * Drop-in replacement for @clerk/nextjs/server
 * 
 * This module provides mock implementations of all Clerk server exports
 * for local development without requiring Clerk API keys.
 */

import { MOCK_USER } from './index';

// Mock auth() function - matches Clerk's auth() signature
export async function auth() {
    return {
        userId: MOCK_USER.clerkId,
        sessionId: 'mock-session-id',
        getToken: async () => 'mock-token',
        sessionClaims: null,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        orgPermissions: null,
        has: () => false,
        protect: async () => { },
    };
}

// Mock currentUser() function
export async function currentUser() {
    return {
        id: MOCK_USER.clerkId,
        firstName: 'Dev',
        lastName: 'User',
        username: MOCK_USER.username,
        emailAddresses: [{ emailAddress: MOCK_USER.email }],
        imageUrl: MOCK_USER.imageUrl,
        primaryEmailAddressId: 'email_1',
        createdAt: MOCK_USER.createdAt.getTime(),
        updatedAt: MOCK_USER.updatedAt.getTime(),
        publicMetadata: {},
        privateMetadata: {},
        unsafeMetadata: {},
    };
}

// Mock clerkMiddleware - returns a pass-through middleware
export function clerkMiddleware() {
    return () => undefined; // Pass through
}

// Mock createRouteMatcher
export function createRouteMatcher(_patterns: string[]) {
    return () => false;
}

// Mock clerkClient
export const clerkClient = {
    users: {
        getUser: async () => currentUser(),
        getUserList: async () => ({ data: [await currentUser()], totalCount: 1 }),
        updateUser: async () => currentUser(),
        deleteUser: async () => ({}),
    },
    sessions: {
        getSession: async () => ({ id: 'mock-session-id', userId: MOCK_USER.clerkId }),
        getSessionList: async () => ({ data: [], totalCount: 0 }),
    },
    organizations: {
        getOrganization: async () => null,
        getOrganizationList: async () => ({ data: [], totalCount: 0 }),
    },
};

// Mock getAuth for API routes
export function getAuth() {
    return {
        userId: MOCK_USER.clerkId,
        sessionId: 'mock-session-id',
        getToken: async () => 'mock-token',
    };
}

// Export Webhook helpers (no-op for local dev)
export class Webhook {
    constructor(_secret: string) { }
    verify(_payload: string, _headers: Record<string, string>) {
        return { type: 'user.created', data: {} };
    }
}

// Re-export types as empty objects (for TypeScript compatibility)
export type User = Awaited<ReturnType<typeof currentUser>>;
export type Auth = Awaited<ReturnType<typeof auth>>;
