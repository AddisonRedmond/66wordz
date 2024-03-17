import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import Stripe from "stripe";
const YOUR_DOMAIN = "http://localhost:3000";

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"],
      mode: "subscription",
      metadata: {
        userId: ctx.session.user.id,
      },
      line_items: [
        {
          price: "price_1OudZ2KOAAy2nRAZDErp78vY", // Use the Price ID of your recurring price
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return session.id;
  }),
});
