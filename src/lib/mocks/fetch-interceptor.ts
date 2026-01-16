/**
 * Fetch interceptor for local development
 *
 * Intercepts calls to external APIs and returns mock responses
 * when USE_LOCAL_DEV is enabled.
 */

import { randomUUID } from 'crypto';

const IS_LOCAL_DEV = process.env.USE_LOCAL_DEV === 'true';

// Store original fetch
const originalFetch = globalThis.fetch;

// In-memory video storage
const mockBunnyVideos = new Map<string, any>();

if (IS_LOCAL_DEV && typeof globalThis.fetch === 'function') {
    console.log('[FetchInterceptor] Installing fetch interceptor for local dev');

    globalThis.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

        // Intercept Bunny CDN API calls
        if (url.includes('video.bunnycdn.com')) {
            console.log(`[FetchInterceptor] Intercepting Bunny API: ${init?.method || 'GET'} ${url}`);

            // Parse the URL to extract library and video ID
            const urlParts = url.match(/library\/([^/]+)\/videos(?:\/([^/?]+))?/);
            const libraryId = urlParts?.[1];
            const videoId = urlParts?.[2];

            // POST /library/{id}/videos - Create video
            if (init?.method === 'POST' && !videoId) {
                const body = init.body ? JSON.parse(init.body as string) : {};
                const guid = randomUUID();
                const video = {
                    guid,
                    title: body.title || 'Untitled',
                    length: 0,
                    status: 0,
                    thumbnailFileName: '',
                    width: 0,
                    height: 0,
                };
                mockBunnyVideos.set(guid, video);
                console.log(`[FetchInterceptor] Created mock video: ${guid}`);
                return new Response(JSON.stringify(video), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // GET /library/{id}/videos/{videoId} - Get video
            if (init?.method === 'GET' || !init?.method) {
                if (videoId) {
                    const video = mockBunnyVideos.get(videoId) || {
                        guid: videoId,
                        title: 'Mock Video',
                        length: 120,
                        status: 3,
                        thumbnailFileName: 'thumbnail.jpg',
                        width: 1920,
                        height: 1080,
                    };
                    return new Response(JSON.stringify(video), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }

            // PUT /library/{id}/videos/{videoId} - Upload video
            if (init?.method === 'PUT' && videoId) {
                const video = mockBunnyVideos.get(videoId);
                if (video) {
                    video.status = 3; // Mark as finished
                    video.width = 1920;
                    video.height = 1080;
                    video.length = 120;
                }
                console.log(`[FetchInterceptor] Mock upload complete for: ${videoId}`);
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // DELETE /library/{id}/videos/{videoId}
            if (init?.method === 'DELETE' && videoId) {
                mockBunnyVideos.delete(videoId);
                console.log(`[FetchInterceptor] Deleted mock video: ${videoId}`);
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Default mock response
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Pass through all other requests
        return originalFetch(input, init);
    };
}

export { };
