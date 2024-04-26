import { Webhook } from "svix";
import {buffer} from "micro"
import { env } from "~/env.mjs";
import { db } from "~/server/db";

import type { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: false
    }
}

const webhook = async (req:NextApiRequest, res: NextApiResponse) => {
    console.log("API HIT")
    if(req.method !== "POST"){
        return res.status(405);
    }

    const svix_id = req.headers["svix-id"] as string; 
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if( !svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({error: "error occurred - no svix headers"})
    }

     const body = ((await buffer(req)).toString());
     const wh = new Webhook(env.CLERK_SIGNING_SECRET)

     let event: WebhookEvent;

     try {
        event = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
        console.log("WH verified")
     } catch(e) {
        console.log(e)
        return res.status(400).json({Error: e})
     }

     const user = event.data;
     const eventType = event.type;

     console.log("CREATING USER");
     switch(eventType){
        case "user.created": {
            const count = await db.user.count({
                where: {
                    id: user.id!,
                }
            })

            // 
            if(!count) {
                await db.user.create({data: {
                    id: user.id,
                    name: `${event.data.first_name} ${event.data.last_name}`, 
                    // TODO: ensure email address is included
                    email: event.data.email_addresses[0]!.email_address,
                    image: event.data.image_url,

                }})
            }
        }
     }

     return res.status(200).json({reponse: "success"})
}

export default webhook