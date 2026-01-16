import type { NextConfig } from "next";
import path from "path";
import webpack from "webpack";

const IS_LOCAL_DEV = process.env.USE_LOCAL_DEV === 'true';
console.log(`[NextConfig] USE_LOCAL_DEV=${process.env.USE_LOCAL_DEV} IS_LOCAL_DEV=${IS_LOCAL_DEV}`);

// Helper to ensure paths uses forward slashes on Windows
const toPosix = (p: string) => p.replace(/\\/g, '/');

// Absolute paths for webpack module aliasing in local dev mode
const mocksDir = toPosix(path.resolve(__dirname, 'src/lib/mocks'));
const mockAliases = IS_LOCAL_DEV ? {
    // Clerk Auth
    '@clerk/nextjs/server': toPosix(path.join(mocksDir, 'clerk-server-mock.ts')),
    '@clerk/nextjs': toPosix(path.join(mocksDir, 'clerk-client-mock.tsx')),
    // Upstash (Redis + Rate Limiting)
    '@upstash/ratelimit': toPosix(path.join(mocksDir, 'upstash-ratelimit-mock.ts')),
    '@upstash/redis': toPosix(path.join(mocksDir, 'upstash-redis-mock.ts')),
    // Mux (not actively used, Bunny is primary)
    '@mux/mux-node': toPosix(path.join(mocksDir, 'mux-mock.ts')),
    // Mock Bunny (when local dev is active)
    '@/lib/bunny': toPosix(path.join(mocksDir, 'bunny-mock.ts')),
    // Local redis.ts -> mock
    '@/lib/redis': toPosix(path.join(mocksDir, 'redis-shim.ts')),
} : {};

// Database mock path for NormalModuleReplacementPlugin
const dbMockPath = toPosix(path.join(mocksDir, 'db-shim.ts'));

const nextConfig: NextConfig = {
    transpilePackages: ["@uploadthing/react", "uploadthing"],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        // Either use domains:
        // domains: ["images.unsplash.com", "image.mux.com", "assets.mux.com"],

        // …or remotePatterns (more flexible/recommended):
        remotePatterns: [
            { protocol: "https", hostname: "img.clerk.com" },  // Clerk user profile images
            { protocol: "https", hostname: "image.mux.com" },   // Mux poster/thumbnail
            { protocol: "https", hostname: "assets.mux.com" },  // Mux storyboards, etc.
            { protocol: "https", hostname: "utfs.io" },  // UploadThing
            { protocol: "https", hostname: "i.ytimg.com" }, // YouTube Thumbnails
            { protocol: "https", hostname: "yt3.ggpht.com" }, // YouTube Channel Avatars
            { protocol: "https", hostname: "api.dicebear.com" }, // Mock avatars for local dev
            {
                protocol: "https",
                hostname: process.env.NEXT_PUBLIC_BUNNY_PULLZONE_HOST || "vz-cd04a7d4-494.b-cdn.net",
                pathname: "/**",
            },

            //FOR AWS
            {
                protocol: "https",
                hostname: "*.s3.*.amazonaws.com",
                pathname: "/**",
            },

        ],
        formats: ["image/avif", "image/webp"],
    },

    // Webpack configuration for module aliasing in local dev mode
    webpack: (config, { isServer }) => {
        if (IS_LOCAL_DEV) {
            const alias = config.resolve.alias || {};

            // Add mock aliases
            Object.assign(alias, mockAliases);

            config.resolve.alias = alias;

            // Use NormalModuleReplacementPlugin for @/db - this is more reliable
            // than aliases because it intercepts AFTER tsconfig paths are resolved
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(
                    /^@\/db$/,
                    dbMockPath
                )
            );

            console.log(`[LocalDev] Webpack aliases configured for ${isServer ? 'server' : 'client'}`);
            // console.log('Aliases:', JSON.stringify(alias, null, 2));
        }
        return config;
    },
};
export default nextConfig;