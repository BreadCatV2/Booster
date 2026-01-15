"use client";

/**
 * Clerk Shim for Local Development
 *
 * This module re-exports either real Clerk or mock implementations
 * based on the USE_LOCAL_DEV environment variable.
 *
 * Usage: Instead of importing from '@clerk/nextjs', import from '@/lib/mocks/clerk-shim'
 */

import {
  mockUseAuth,
  mockUseUser,
  mockUseClerk,
} from './auth-mock';

import {
  MockSignedIn,
  MockSignedOut,
  MockClerkLoading,
  MockClerkLoaded,
  MockClerkProvider,
  MockUserButton,
  MockSignInButton,
  MockSignUpButton,
  MockSignOutButton,
} from './auth-components';

const IS_LOCAL_DEV = process.env.NEXT_PUBLIC_USE_LOCAL_DEV === 'true' || process.env.USE_LOCAL_DEV === 'true';

// Client-side hooks
export const useAuth = IS_LOCAL_DEV
  ? mockUseAuth
  : require('@clerk/nextjs').useAuth;

export const useUser = IS_LOCAL_DEV
  ? mockUseUser
  : require('@clerk/nextjs').useUser;

export const useClerk = IS_LOCAL_DEV
  ? mockUseClerk
  : require('@clerk/nextjs').useClerk;

// Components
export const SignedIn = IS_LOCAL_DEV
  ? MockSignedIn
  : require('@clerk/nextjs').SignedIn;

export const SignedOut = IS_LOCAL_DEV
  ? MockSignedOut
  : require('@clerk/nextjs').SignedOut;

export const ClerkLoading = IS_LOCAL_DEV
  ? MockClerkLoading
  : require('@clerk/nextjs').ClerkLoading;

export const ClerkLoaded = IS_LOCAL_DEV
  ? MockClerkLoaded
  : require('@clerk/nextjs').ClerkLoaded;

export const ClerkProvider = IS_LOCAL_DEV
  ? MockClerkProvider
  : require('@clerk/nextjs').ClerkProvider;

export const UserButton = IS_LOCAL_DEV
  ? MockUserButton
  : require('@clerk/nextjs').UserButton;

// Re-export other components that might be used
export const SignInButton = IS_LOCAL_DEV
  ? MockSignInButton
  : require('@clerk/nextjs').SignInButton;

export const SignUpButton = IS_LOCAL_DEV
  ? MockSignUpButton
  : require('@clerk/nextjs').SignUpButton;

export const SignOutButton = IS_LOCAL_DEV
  ? MockSignOutButton
  : require('@clerk/nextjs').SignOutButton;
