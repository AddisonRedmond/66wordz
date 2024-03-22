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
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2023-10-16",
    });

    const subscriptionId = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!subscriptionId?.subscriptionId) {
      throw new Error("No subscription found");
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId?.subscriptionId,
      {
        metadata: {
          userId: ctx.session.user.id,
        },
        cancel_at_period_end: true,
      },
    );

    // console.log(
    //   await stripe.subscriptions.retrieve(subscriptionId?.subscriptionId),
    // );
    return { successfullyCancelled: subscription.cancel_at_period_end };
  }),

  reactiveateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      apiVersion: "2023-10-16",
    });

    const subscriptionId = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!subscriptionId?.subscriptionId) {
      throw new Error("No subscription found");
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId?.subscriptionId,
      {
        metadata: {
          userId: ctx.session.user.id,
        },
        cancel_at_period_end: false,
      },
    );

    console.log(subscription)
    return;
  }),
});
