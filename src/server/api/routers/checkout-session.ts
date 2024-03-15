import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import Stripe from "stripe";
const YOUR_DOMAIN = "http://localhost:3000";

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async () => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: "price_1OudZ2KOAAy2nRAZDErp78vY", // Use the Price ID of your recurring price
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}?success=session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return session.id;
  }),
});
