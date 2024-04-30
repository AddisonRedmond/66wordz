import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  // If there is no signed in user, this will return a 404 error

  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log(userId);
  // Add your Route Handler logic here

  res.status(200).json("Hello from Next.js!");
}

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   auth().protect();

//   res.status(200).json({ message: "Hello from Next.js!" });
// }
