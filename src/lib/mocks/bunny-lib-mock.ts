/**
 * Mock Bunny CDN library for local development
 */

import { randomUUID } from 'crypto';

console.log('[MockBunny] Bunny CDN library mock loaded');

export const statusMap = new Map<string, string>([
    ["0", "queued"],
    ["1", "processing"],
    ["2", "encoding"],
    ["3", "finished"],
    ["4", "resolution_finished"],
    ["5", "failed"],
]);

// In-memory video storage for local dev
const mockVideos = new Map<string, {
    guid: string;
    title: string;
    length: number;
    status: number;
    thumbnailFileName: string;
    width: number;
    height: number;
    createdAt: Date;
}>();

export async function getBunnyVideo(libraryId: string, videoId: string) {
    console.log(`[MockBunny] getBunnyVideo(${libraryId}, ${videoId})`);

    const video = mockVideos.get(videoId);
    if (!video) {
        // Return a mock video if not found
        return {
            guid: videoId,
            title: 'Mock Video',
            length: 120,
            status: 3, // finished
            thumbnailFileName: 'thumbnail.jpg',
            width: 1920,
            height: 1080,
        };
    }
    return video;
}

export async function deleteBunnyVideo(libraryId: string, videoId: string) {
    console.log(`[MockBunny] deleteBunnyVideo(${libraryId}, ${videoId})`);
    mockVideos.delete(videoId);
    return { success: true };
}

export async function createBunnyVideo(libraryId: string, title: string) {
    const guid = randomUUID();
    console.log(`[MockBunny] createBunnyVideo(${libraryId}, ${title}) -> ${guid}`);

    mockVideos.set(guid, {
        guid,
        title,
        length: 0,
        status: 0, // queued
        thumbnailFileName: '',
        width: 0,
        height: 0,
        createdAt: new Date(),
    });

    return { guid };
}

export async function uploadBunnyVideoStream(libraryId: string, videoId: string, stream: ReadableStream) {
    console.log(`[MockBunny] uploadBunnyVideoStream(${libraryId}, ${videoId})`);

    // Update status to processing
    const video = mockVideos.get(videoId);
    if (video) {
        video.status = 1; // processing
        // After a short delay, mark as finished
        setTimeout(() => {
            const v = mockVideos.get(videoId);
            if (v) {
                v.status = 3; // finished
                v.width = 1920;
                v.height = 1080;
                v.length = 120;
            }
        }, 2000);
    }

    return { success: true };
}
