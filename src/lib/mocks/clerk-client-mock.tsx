"use client";

/**
 * Drop-in replacement for @clerk/nextjs
 *
 * This module provides mock implementations of all Clerk client exports
 * for local development without requiring Clerk API keys.
 */

import React from 'react';

const MOCK_USER = {
    clerkId: 'clerk_local_dev_user',
    name: 'Dev User',
    username: 'devuser',
    email: 'dev@localhost',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser',
};

// ============================================
// HOOKS
// ============================================

export function useAuth() {
    return {
        isLoaded: true,
        isSignedIn: true,
        userId: MOCK_USER.clerkId,
        sessionId: 'mock-session-id',
        signOut: async () => { console.log('[MockAuth] Sign out called'); },
        getToken: async () => 'mock-token',
        has: () => false,
        orgId: null,
        orgRole: null,
        orgSlug: null,
    };
}

export function useUser() {
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
            publicMetadata: {},
            unsafeMetadata: {},
        },
    };
}

export function useClerk() {
    return {
        openSignIn: () => { console.log('[MockAuth] openSignIn called - already signed in as dev user'); },
        openSignUp: () => { console.log('[MockAuth] openSignUp called - already signed in as dev user'); },
        openUserProfile: () => { console.log('[MockAuth] openUserProfile called'); },
        signOut: async () => { console.log('[MockAuth] signOut called'); },
        user: useUser().user,
        session: { id: 'mock-session-id' },
        loaded: true,
        client: null,
    };
}

export function useSignIn() {
    return {
        isLoaded: true,
        signIn: null,
        setActive: async () => { },
    };
}

export function useSignUp() {
    return {
        isLoaded: true,
        signUp: null,
        setActive: async () => { },
    };
}

export function useSession() {
    return {
        isLoaded: true,
        isSignedIn: true,
        session: { id: 'mock-session-id', userId: MOCK_USER.clerkId },
    };
}

export function useOrganization() {
    return {
        isLoaded: true,
        organization: null,
        membership: null,
    };
}

export function useOrganizationList() {
    return {
        isLoaded: true,
        organizationList: [],
        userMemberships: { data: [], count: 0 },
    };
}

// ============================================
// COMPONENTS
// ============================================

export function ClerkProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function SignedIn({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
    // User is always signed in during local dev
    return null;
}

export function UserButton(props: Record<string, unknown>) {
    return (
        <div
            style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                cursor: 'pointer',
            }}
            title="Dev User (Mock Auth)"
            onClick={() => console.log('[MockAuth] UserButton clicked')}
        >
            D
        </div>
    );
}

export function SignInButton({ children, mode, ...props }: { children?: React.ReactNode; mode?: string } & Record<string, unknown>) {
    return <>{children || <button>Sign In</button>}</>;
}

export function SignUpButton({ children, mode, ...props }: { children?: React.ReactNode; mode?: string } & Record<string, unknown>) {
    return <>{children || <button>Sign Up</button>}</>;
}

export function SignOutButton({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) {
    return (
        <button onClick={() => console.log('[MockAuth] Sign out clicked')}>
            {children || 'Sign Out'}
        </button>
    );
}

export function SignIn(props: Record<string, unknown>) {
    return <div>Mock Sign In Component - Already signed in as Dev User</div>;
}

export function SignUp(props: Record<string, unknown>) {
    return <div>Mock Sign Up Component - Already signed in as Dev User</div>;
}

export function UserProfile(props: Record<string, unknown>) {
    return (
        <div style={{ padding: 20 }}>
            <h2>Dev User Profile</h2>
            <p>Username: {MOCK_USER.username}</p>
            <p>Email: {MOCK_USER.email}</p>
            <p style={{ color: '#666', fontSize: 12 }}>(Mock profile for local development)</p>
        </div>
    );
}

export function OrganizationSwitcher(props: Record<string, unknown>) {
    return null;
}

export function OrganizationProfile(props: Record<string, unknown>) {
    return null;
}

export function CreateOrganization(props: Record<string, unknown>) {
    return null;
}

export function RedirectToSignIn(props: Record<string, unknown>) {
    return <div>Redirecting to sign in... (Mock - already signed in)</div>;
}

export function RedirectToSignUp(props: Record<string, unknown>) {
    return <div>Redirecting to sign up... (Mock - already signed in)</div>;
}

export function RedirectToUserProfile(props: Record<string, unknown>) {
    return <div>Redirecting to profile... (Mock)</div>;
}

export function Protect({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    // Always show protected content in local dev
    return <>{children}</>;
}

// ============================================
// AUTH HELPERS (for compatibility)
// ============================================

export function withClerkMiddleware(handler: Function) {
    return handler;
}

export const auth = async () => ({
    userId: MOCK_USER.clerkId,
    sessionId: 'mock-session-id',
    getToken: async () => 'mock-token',
});

export const currentUser = async () => ({
    id: MOCK_USER.clerkId,
    firstName: 'Dev',
    lastName: 'User',
    username: MOCK_USER.username,
    imageUrl: MOCK_USER.imageUrl,
    emailAddresses: [{ emailAddress: MOCK_USER.email }],
});

// Export a default for any dynamic imports
export default {
    ClerkProvider,
    SignedIn,
    SignedOut,
    UserButton,
    SignInButton,
    SignUpButton,
    SignOutButton,
    useAuth,
    useUser,
    useClerk,
};
