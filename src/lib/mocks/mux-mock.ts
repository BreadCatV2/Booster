/**
 * Mock Mux SDK
 *
 * Provides mock responses for Mux API calls in local development.
 * Mux is not actively used (Bunny is the primary video host).
 */

class MockVideo {
    assets = {
        create: async (_params: unknown) => ({
            id: `mock-asset-${Date.now()}`,
            status: 'ready',
            playback_ids: [{ id: 'mock-playback-id', policy: 'public' }],
        }),
        retrieve: async (_assetId: string) => ({
            id: _assetId,
            status: 'ready',
            playback_ids: [{ id: 'mock-playback-id', policy: 'public' }],
            duration: 120,
        }),
        delete: async (_assetId: string) => ({}),
        list: async () => ({ data: [] }),
        createPlaybackId: async (_assetId: string, _params: unknown) => ({
            id: 'mock-playback-id',
            policy: 'public',
        }),
    };

    uploads = {
        create: async (_params: unknown) => ({
            id: `mock-upload-${Date.now()}`,
            url: 'https://example.com/mock-upload-url',
            status: 'waiting',
        }),
        retrieve: async (_uploadId: string) => ({
            id: _uploadId,
            status: 'asset_created',
            asset_id: 'mock-asset-id',
        }),
    };

    liveStreams = {
        create: async (_params: unknown) => ({
            id: `mock-stream-${Date.now()}`,
            stream_key: 'mock-stream-key',
            status: 'idle',
            playback_ids: [{ id: 'mock-playback-id', policy: 'public' }],
        }),
        retrieve: async (_streamId: string) => ({
            id: _streamId,
            status: 'idle',
        }),
        delete: async (_streamId: string) => ({}),
    };

    playbackIds = {
        retrieve: async (_playbackId: string) => ({
            id: _playbackId,
            policy: 'public',
        }),
    };
}

class MockData {
    video = new MockVideo();
}

const globalForMux = globalThis as unknown as { _muxLogged: boolean };

export default class Mux {
    video: MockVideo;
    data: MockData;

    constructor(_config?: { tokenId?: string; tokenSecret?: string }) {
        if (!globalForMux._muxLogged) {
            console.log('[MockMux] Initialized Mux mock (Bunny is primary video host)');
            globalForMux._muxLogged = true;
        }
        this.video = new MockVideo();
        this.data = new MockData();
    }
}

export { Mux };
