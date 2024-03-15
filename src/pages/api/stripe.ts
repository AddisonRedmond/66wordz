import { NextApiRequest, NextApiResponse } from "next";

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const event = req.body;
        console.log(event);
        res.status(200).json({ received: true });
    
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};
