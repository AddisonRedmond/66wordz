import { getSession } from "next-auth/react";

export const authRequired = async (context: any, isLogin: boolean) => {
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
