import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

type ResponseData = {
  lobbyId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.body !== "POST") {
    return res.status(405);
  }
  const data = JSON.parse(req.body);
  const lobbyId = data.lobbyId;

  //   cors isnt working btw/ origin can be any, need to fix
  const players = await db.players.findMany({ where: { lobbyId: lobbyId } });
  const playerIds = players.map((player) => player.userId);

  await db.user.updateMany({
    where: {
      id: {
        in: playerIds,
      },
    },
    data: { freeGameCount: { increment: 1 } },
  });

  await db.lobby.update({ where: { id: lobbyId }, data: { started: true } });
  res.status(200).end();
}
