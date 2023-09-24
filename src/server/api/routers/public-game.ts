import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const publicGameRouter = createTRPCRouter({

joinPublicGame:  protectedProcedure.mutation(() => {
    // check data base for a lobby that has < 50 players and hasn't started yet

    // if there is one already add the user template to the firebase lobby

    // if there is NOT create a new row in the DB and add the user to template to the firebase lobby
})


});
