import { z } from "zod";
import { db } from "@/db";
import { comments, videoRatings, videos, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc, sql, getTableColumns, avg, count, sum } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const studioRouter = createTRPCRouter({

    getOne: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {


            const [video] = await db
                .select({
                    ...getTableColumns(videos),
                    views: sql<number>`SUM(${videoViews.seen})`.mapWith(Number),
                })
                .from(videos)
                .leftJoin(videoViews, eq(videoViews.videoId, videos.id))
                .where(eq(videos.id, input.id))
                .groupBy(videos.id);
            if (!video) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }
            return video;
        }),

    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string().uuid(),
                    updatedAt: z.date(),
                }).nullish(),
                limit: z.number().min(1).max(100),
            })
        )
        .query(async ({ ctx, input }) => {
            const { cursor, limit } = input;
            const { id: userId } = ctx.user; //rename id to userId


            const viewsAgg = db
                .select({
                    videoId: videoViews.videoId,
                    views: sum(videoViews.seen).as('views')
                })
                .from(videoViews)
                .groupBy(videoViews.videoId)
                .as("views_agg");

            const ratingsAgg = db
                .select({
                    videoId: videoRatings.videoId,
                    avgRating: avg(videoRatings.rating).as('avgRating')
                })
                .from(videoRatings)
                .groupBy(videoRatings.videoId)
                .as("ratings_agg");

            const commentsAgg = db
                .select({
                    videoId: comments.videoId,
                    commentsCount: count(comments.videoId).as('commentsCount')
                })
                .from(comments)
                .groupBy(comments.videoId)
                .as("comments_agg");

            const data = await db.select({
                ...getTableColumns(videos),
                videoViews: viewsAgg.views,
                videoRatings: ratingsAgg.avgRating,
                videoComments: commentsAgg.commentsCount,
            }).from(videos)
                .leftJoin(viewsAgg, eq(viewsAgg.videoId, videos.id))
                .leftJoin(ratingsAgg, eq(ratingsAgg.videoId, videos.id))
                .leftJoin(commentsAgg, eq(commentsAgg.videoId, videos.id))
                .where(
                    and(
                        eq(videos.userId, userId),
                        cursor ?
                            or(
                                lt(videos.updatedAt, cursor.updatedAt)
                                , and(
                                    eq(videos.updatedAt, cursor.updatedAt),
                                    lt(videos.id, cursor.id)
                                ))
                            : undefined)).
                orderBy(desc(videos.updatedAt), desc(videos.id))
                .limit(limit + 1); //ad 1 to limit to check if there's more data

            const hasMore = data.length > limit;
            //remove last item if hasMore
            const items = hasMore ? data.slice(0, -1) : data;

            const lastItem = items[items.length - 1];
            const nextCursor = hasMore ?
                {
                    id: lastItem.id,
                    updatedAt: lastItem.updatedAt,
                } : null;

            return {
                items,
                nextCursor,
            }
        })
})    
