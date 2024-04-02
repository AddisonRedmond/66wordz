import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import Cors from "cors";
import { env } from "~/env.mjs";
type ResponseData = {
  lobbyId: string;
};

const cors = Cors({
  origin: env.BOT_SERVER,
  methods: ["POST", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    cb: any,
  ) => Promise<void> | void,
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  await runMiddleware(req, res, cors);
  const data = JSON.parse(req.body);
  const lobbyId = data.lobbyId;

  console.log("lobbyId!!!", lobbyId);
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
