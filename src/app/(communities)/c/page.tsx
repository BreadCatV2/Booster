import { DEFAULT_COMMUNITIES_LIMIT } from "@/constants";
import { CommunitiesSection } from "@/modules/community/ui/sections/communities-section";
import { HydrateClient,trpc } from "@/trpc/server";

export const dynamic = 'force-dynamic'; //IMPORTANT: WE DON'T AWAIT. BUT RATHER WE PREFETCH

interface Props{
    searchParams: Promise<{
        categoryId: string | undefined;
    }>
}

const Page = async ({searchParams}:Props) => {    


    const {categoryId} = await searchParams;

    //todo: prefetch communities
    void trpc.community.getMany.prefetchInfinite({categoryId, limit: DEFAULT_COMMUNITIES_LIMIT});
    
    return (
        <HydrateClient>
            <CommunitiesSection categoryId={categoryId}/>
        </HydrateClient>
    )
}

export default  Page;