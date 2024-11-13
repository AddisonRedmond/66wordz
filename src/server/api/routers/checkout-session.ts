import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import Stripe from "stripe";

const url = "https://www.66wordz.com/"

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2024-09-30.acacia",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"],
      mode: "subscription",
      metadata: {
        userId: ctx.session.userId,
      },
      line_items: [
        {
          price: env.STRIPE_GOLD_MONTHLY_PRICE_ID, // Use the Price ID of your recurring price
          quantity: 1,
        },
      ],
      success_url: `${url}/`,
      cancel_url: `${url}?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return session.id;
  }),
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
    });
    if (user?.cancelAtPeriodEnd === null || user?.cancelAtPeriodEnd === true) {
      return;
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2024-09-30.acacia",
    });

    const subscriptionId = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
    });

    if (!subscriptionId?.subscriptionId) {
      throw new Error("No subscription found");
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId?.subscriptionId,
      {
        metadata: {
          userId: ctx.session.userId,
        },
        cancel_at_period_end: true,
      },
    );

    await ctx.db.user.update({
      where: { id: ctx.session.userId },
      data: { cancelAtPeriodEnd: true },
    });

    return { successfullyCancelled: subscription.cancel_at_period_end };
  }),
});
