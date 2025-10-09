import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function PUT (req: Request) {
 const { searchParams } = new URL(req.url);
  //TODO: make it more secure xd. Check that the update comes from a reliable source



  const queryValue = searchParams.get('id'); 

  const duration   = searchParams.get('duration');





  console.log('Received query:', queryValue);

  const videoId = queryValue?.split('_')[0].split('/')[1] || ""

  console.log("VIDEO ID",videoId)

  if(!duration){
    await db.update(videos)
      .set({
        status: "completed",
      })
      .where(eq(videos.id, videoId))
  }else{
    await db.update(videos)
    .set({
      duration: Number(duration)
    })
    .where(eq(videos.id,videoId))
  }

  return new Response(`Received query: ${queryValue}`);
}