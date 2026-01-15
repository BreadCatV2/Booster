"use client";

/**
 * Mock Clerk React Components
 * 
 * Provides mock React components for local development
 */

import React from 'react';

// Mock SignedIn component
export function MockSignedIn({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

// Mock SignedOut component  
export function MockSignedOut({ children }: { children: React.ReactNode }) {
    return null; // Never render - user is always signed in
}

// Mock ClerkProvider component
export function MockClerkProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

// Mock UserButton component
export function MockUserButton() {
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
            }}
            title="Dev User (Mock Auth)"
        >
            D
        </div>
    );
}

// Mock SignInButton
export function MockSignInButton({ children }: { children?: React.ReactNode }) {
    return <>{children || 'Sign In'}</>;
}

// Mock SignUpButton
export function MockSignUpButton({ children }: { children?: React.ReactNode }) {
    return <>{children || 'Sign Up'}</>;
}

// Mock SignOutButton
export function MockSignOutButton({ children }: { children?: React.ReactNode }) {
    return (
        <button onClick={() => console.log('[MockAuth] Sign out clicked')}>
            {children || 'Sign Out'}
        </button>
    );
}
