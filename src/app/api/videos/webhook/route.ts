import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";



//TODO: Protect this webhook so that only the ECS can access it. -> Add a webhook secret in both ecs and here and decode stuff ... + add reply attack preventions?


// function safeEqual(a: string, b: string) {
//   const ab = Buffer.from(a);
//   const bb = Buffer.from(b);
//   if (ab.length !== bb.length) return false;
//   return crypto.timingSafeEqual(ab, bb);
// }

// function sign(base: string, secret: string) {
//   return crypto.createHmac("sha256", secret).update(base).digest("hex");
// }


export async function PUT (req: Request) {
 const { searchParams } = new URL(req.url);
  //TODO: make it more secure xd. Check that the update comes from a reliable source



  const queryValue = searchParams.get('id'); 

  const duration   = Math.floor(Number(searchParams.get('duration')));


  console.log('Received query:', queryValue);

  const videoId = queryValue?.split('_')[0].split('/')[1] || ""
  
  console.log("DURATION",duration)

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