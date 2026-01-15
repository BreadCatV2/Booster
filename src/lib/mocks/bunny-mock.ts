/**
 * Mock Bunny CDN
 * 
 * Provides static video responses for local development and persistence
 */
import fs from 'fs';
import path from 'path';

// --- Persistence Setup ---
const DB_PATH = path.resolve(process.cwd(), '.local-bunny.json');

// Ensure database file exists
if (!fs.existsSync(DB_PATH)) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify({}));
  } catch (e) {
    console.error('[MockBunny] Failed to initialize DB file:', e);
  }
}

// In-memory cache backed by file
const globalForBunny = globalThis as unknown as {
  _mockBunnyStore: Record<string, any> | undefined;
};

if (!globalForBunny._mockBunnyStore) {
  try {
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    globalForBunny._mockBunnyStore = fileContent.trim() ? JSON.parse(fileContent) : {};
  } catch (e) {
    console.warn('[MockBunny] Failed to read DB, starting fresh', e);
    globalForBunny._mockBunnyStore = {};
  }
}
const store = globalForBunny._mockBunnyStore!;

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('[MockBunny] Save failed:', e);
  }
}

export const statusMap = new Map<string, string>([
  ["0", "queued"],
  ["1", "processing"],
  ["2", "encoding"],
  ["3", "finished"],
  ["4", "resolution_finished"],
  ["5", "failed"],
]);

export async function getBunnyVideo(_libraryId: string, videoId: string) {
  // console.log(`[MockBunny] getBunnyVideo called for: ${videoId}`);

  if (store[videoId]) {
    return store[videoId];
  }

  // Fallback for non-existent videos (or simulated ones)
  return {
    guid: videoId,
    title: `Mock Video ${videoId}`,
    length: 120,
    status: 3, // finished
    thumbnailFileName: 'thumbnail.jpg',
    width: 1920,
    height: 1080,
  };
}

export async function deleteBunnyVideo(_libraryId: string, videoId: string) {
  if (store[videoId]) {
    delete store[videoId];
    saveDb();
  }
  return { success: true };
}

export async function createBunnyVideo(_libraryId: string, title: string) {
  const guid = crypto.randomUUID();

  const newVideo = {
    guid,
    title,
    length: 0,
    status: 0, // queued
    thumbnailFileName: 'thumbnail.jpg',
    width: 0,
    height: 0,
    createdAt: new Date().toISOString(),
  };

  store[guid] = newVideo;
  saveDb();

  return newVideo;
}

// Helper to get mock video URL (returns a placeholder)
export function getMockVideoUrl(videoId: string) {
  // Check if local file exists
  const localPath = `/uploads/${videoId}.mp4`;
  return localPath;
}

// Helper to get mock thumbnail URL
export function getMockThumbnailUrl(_videoId: string) {
  return 'https://via.placeholder.com/1280x720/6366f1/ffffff?text=Mock+Video';
}
