"use client";

import { trpc } from "@/trpc/client";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { compactNumber, compactDate } from "@/lib/utils";
import {
  EyeIcon,
  EyeOff,
  StarIcon,
  VideoOff,
  Clapperboard,
} from "lucide-react";

interface UserVideoListProps {
  userId: string;
  isOwnProfile: boolean;
}

export const UserVideoList = ({ userId, isOwnProfile }: UserVideoListProps) => {
  const [userVideos] = trpc.users.getVideosByUserId.useSuspenseQuery({ userId });

  const filteredVideos = userVideos.userVideos.filter(
    (video) => isOwnProfile || video.visibility === "public"
  );

  if (filteredVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 mt-6 border border-dashed border-border rounded-2xl bg-muted/10">
        <div className="bg-muted/50 rounded-full p-6 mb-4">
          <VideoOff className="size-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No videos found
        </h3>
        <p className="text-muted-foreground text-center max-w-sm px-4">
          {isOwnProfile
            ? "You haven't uploaded any videos yet."
            : "This user hasn't uploaded any videos yet or they are private."}
        </p>
        {isOwnProfile && (
          <Link href="/studio">
            <Button className="mt-6 rounded-full" variant="default">
              <Clapperboard className="size-4 mr-2" />
              Go to Studio
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {filteredVideos.map((video) => (
        <Link
          key={video.id}
          className="group bg-card border border-border rounded-2xl transition-transform hover:scale-[1.02] cursor-pointer shadow-sm"
          href={`/videos/${video.id}`}
        >
          <div className="relative overflow-hidden rounded-t-2xl">
            <VideoThumbnail
              duration={video.duration || 0}
              title={video.title}
              imageUrl={video.thumbnailUrl}
              previewUrl={video.previewUrl}
              isAi={video.isAi}
            />
            {video.visibility === "private" && (
              <div className="absolute top-2 left-2 bg-black/60 rounded-md p-1">
                <EyeOff className="size-4 text-white" />
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold line-clamp-2 mb-2 text-foreground">
              {video.title || "Untitled Video"}
            </h3>
            <div className="flex justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <EyeIcon className="size-4" />
                  {compactNumber(Number(video.videoViews) || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <StarIcon className="size-4 text-yellow-500 dark:text-yellow-300" />
                  {(Number(video.averageRating) || 0).toFixed(1)}
                </span>
              </div>
              <span>{compactDate(video.createdAt)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

interface UserVideoCountProps {
  userId: string;
}

export const UserVideoCount = ({ userId }: UserVideoCountProps) => {
  const [userVideos] = trpc.users.getVideosByUserId.useSuspenseQuery({ userId });

  return (
    <div className="bg-muted/50 p-3 rounded-lg border border-border text-center min-w-[90px] transition-transform">
      <div className="text-primary font-bold text-lg">
        {userVideos.userVideos.length}
      </div>
      <div className="text-muted-foreground text-xs uppercase">
        Video{userVideos.userVideos.length === 1 ? "" : "s"}{" "}
      </div>
    </div>
  );
};
