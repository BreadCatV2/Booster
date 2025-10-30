// /app/api/bunny/sign/route.ts
import crypto from "crypto";

export async function POST(req: Request) {
  const { videoId } = await req.json() as { videoId: string };
  if (!videoId) return new Response("Missing videoId", { status: 400 });

  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
  const apiKey    = process.env.BUNNY_STREAM_API_KEY!;

  const expires = Math.floor(Date.now()/1000) + 10 * 60; // 10 minutes por poner algo xD
  const payload = `${libraryId}${apiKey}${expires}${videoId}`;
  const signature = crypto.createHash("sha256").update(payload).digest("hex");

  return Response.json({
    libraryId,
    videoId,
    expires,
    signature,
  });
}
