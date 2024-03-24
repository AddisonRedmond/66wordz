import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
export type AuthContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  params: { [key: string]: string | string[] };
  query: { [key: string]: string | string[] };
  preview?: boolean;
  previewData?: { [key: string]: any };
  resolvedUrl?: string;
  session: Session | null | undefined; // Assuming the session is retrieved using NextAuth.js
};
export const authRequired = async (
  context: AuthContext,
  isLogin: boolean,
) => {
  const session = await getSession(context);

  if (isLogin && session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!isLogin && !session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
