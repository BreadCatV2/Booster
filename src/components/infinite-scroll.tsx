import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
    threshold?: number | number[];
}

export const InfiniteScroll = ({
    isManual=false, 
    hasNextPage, 
    isFetchingNextPage, 
    fetchNextPage,
    rootMargin = '100px',
    threshold = 0.5
}: InfiniteScrollProps) => {
    
    const {targetRef, isIntersecting} = useIntersectionObserver({
        threshold,
        rootMargin,
    });



    useEffect(() => {
        if(isIntersecting && hasNextPage && !isFetchingNextPage && !isManual){
            fetchNextPage();
        }
    },[isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, isManual])


    return (
        <div className={`flex flex-col items-center gap-4 p-4 `}>
             <div ref={targetRef} className="h-1"></div>
            {hasNextPage ? (
                <Button
                    variant='secondary'
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className={`${isManual ? "" : "hidden"}`}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </Button>

            ): <p className="text-xs text-muted-foreground"> End of list.  </p>
            }
        </div>
    )
}
