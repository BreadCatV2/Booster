import { db } from "@/db";
import { sql } from "drizzle-orm";

export const updateVideoScore = async (videoId: string) => {
    await db.execute(sql`
        UPDATE videos v
        SET trending_score = (
            SELECT 
                (
                    LN(
                        POWER(COALESCE(SQRT(u.boost_points * 1000) / 1000, 0) + 1, 1)
                        + LN(GREATEST(COALESCE((SELECT SUM(seen) FROM video_views WHERE video_id = v.id), 0), 1))
                        + TANH(COALESCE(v.average_rating, 0) - 3.5) 
                        * LN(GREATEST(COALESCE(v.rating_count, 0), 1))
                        + LN(GREATEST(COALESCE(v.rating_count, 0), 1))
                        + LN(GREATEST(COALESCE(v.comment_count, 0), 1))
                        + CASE WHEN v.is_featured = true THEN 5.0 ELSE 0.0 END
                    ) * COALESCE(SQRT(u.boost_points * 1000) / 1000, 0)
                )::integer
            FROM users u
            WHERE u.id = v.user_id
        )
        WHERE v.id = ${videoId}
    `);
}
