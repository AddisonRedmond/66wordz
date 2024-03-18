import { NextApiResponse, NextApiRequest } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;
    const body = await getRawBody(req);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig.toString(),
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err: any) {
      res.status(400).json(err);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        const paymentIntent = event.data.object;
        console.log(paymentIntent.metadata);
        await db.user.update({
          where: { id: paymentIntent.metadata!.userId },
          data: { hasUpgraded: true, updagradeDate: new Date() },
        });
        break;
      default:
        console.log(`🔔  Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;
