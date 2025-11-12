import { AnalyticsView } from "@/modules/studio/ui/views/analytics-view";
import { HydrateClient } from "@/trpc/server";

export const dynamic = 'force-dynamic'

const Page = async () => {
    return (
        <HydrateClient>
            <AnalyticsView />
        </HydrateClient>
    );
}

export default Page;