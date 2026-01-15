import { UsersView } from "@/modules/users/views/users-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ userId: string }>;
}


const Page = async ({ params }: PageProps) => {
    const { userId } = await params; //To get the video ID in the route. The folder should be called [videoId] the same as the variable name

    // Parallelize prefetches:
    // Fire and forget for videos to avoid blocking the initial render if it's slow
    void trpc.users.getVideosByUserId.prefetch({ userId });

    // Await the essential data to ensure SSR for the profile info
    await Promise.all([
        trpc.users.getByUserId.prefetch({ userId }),
        trpc.xp.getXpByUserId.prefetch({ userId }),
        trpc.follows.getFollowersByUserId.prefetch({ userId }),
        trpc.videoViews.getAllViewsByUserId.prefetch({ userId })
    ]);


    return (
        <HydrateClient>
            {/* <VideoView videoId={videoId} /> */}
            <UsersView userId={userId} />

        </HydrateClient>
    );
}

export default Page;
