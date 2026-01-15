/**
 * Mock Clerk Authentication
 * 
 * Provides static auth responses for local development
 */

import { MOCK_USER } from './index';

// Mock auth() function - server-side
export async function mockAuth() {
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
    protect: async () => { },
  };
}

// Mock currentUser() function - server-side
export async function mockCurrentUser() {
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
  };
}

// Mock useAuth() hook - client-side
export function mockUseAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: MOCK_USER.clerkId,
    sessionId: 'mock-session-id',
    signOut: async () => { console.log('[MockAuth] Sign out called'); },
    getToken: async () => 'mock-token',
  };
}

// Mock useUser() hook - client-side
export function mockUseUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: MOCK_USER.clerkId,
      firstName: 'Dev',
      lastName: 'User',
      username: MOCK_USER.username,
      fullName: MOCK_USER.name,
      imageUrl: MOCK_USER.imageUrl,
      primaryEmailAddress: { emailAddress: MOCK_USER.email },
      emailAddresses: [{ emailAddress: MOCK_USER.email }],
    },
  };
}

// Mock useClerk() hook - client-side
export function mockUseClerk() {
  return {
    openSignIn: () => { console.log('[MockAuth] openSignIn called - already signed in as dev user'); },
    openSignUp: () => { console.log('[MockAuth] openSignUp called - already signed in as dev user'); },
    openUserProfile: () => { console.log('[MockAuth] openUserProfile called'); },
    signOut: async () => { console.log('[MockAuth] signOut called'); },
    user: mockUseUser().user,
    session: { id: 'mock-session-id' },
    loaded: true,
  };
}
