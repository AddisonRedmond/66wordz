import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import Stripe from "stripe";

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
          price: env.STRIPE_GOLD_MONTHLY_PRICE_ID, // Use the Price ID of your recurring price
          quantity: 1,
        },
      ],
      success_url: `${env.NEXTAUTH_URL}/`,
      cancel_url: `${env.NEXTAUTH_URL}?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return session.id;
  }),
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (user?.cancelAtPeriodEnd === null || user?.cancelAtPeriodEnd === true) {
      return;
    }

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

    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { cancelAtPeriodEnd: true },
    });

    return { successfullyCancelled: subscription.cancel_at_period_end };
  }),

  // reactiveateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
  //   const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  //     typescript: true,
  //     apiVersion: "2023-10-16",
  //   });

  //   const subscriptionId = await ctx.db.user.findUnique({
  //     where: { id: ctx.session.user.id },
  //   });

  //   if (!subscriptionId?.subscriptionId) {
  //     throw new Error("No subscription found");
  //   }

  //   const subscription = await stripe.subscriptions.update(
  //     subscriptionId?.subscriptionId,
  //     {
  //       metadata: {
  //         userId: ctx.session.user.id,
  //       },
  //       cancel_at_period_end: false,
  //     },
  //   );

  // }),
});
