import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST() {
    try{
        const headerList = await headers();
        const origin = headerList.get('origin')

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price:'prod_T8C8kbrpAJYKmf',
                    quantity:1,
                }
            ],
            mode:'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
        })
        
    }catch(e){
        
    }
}



















// import Stripe from "stripe";

// import { NextResponse, NextRequest } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// export const POST = async (req: Request) => {
//     const payload = await req.text();
//     const response = JSON.parse(payload)

//     const signature = req.headers.get("Stripe-Signature")

//     const dateTime = new Date(response?.created * 1000).toLocaleDateString();
//     const timeString = new Date(response?.created * 1000).toLocaleDateString()

//     try{
//         let event = stripe.webhooks.constructEvent(
//             payload,
//             signature!,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         )
//         console.log("event", event.type)
    
//         if(event.type === "charge.succeeded"){
//             console.log("actualizar db")
//         }
    
//         return NextResponse.json({status: "success", event: event.type})
//     }catch(e){

//     }
