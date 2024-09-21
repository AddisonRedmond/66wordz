import Head from "next/head";

import Tile from "~/components/tile";
import { m } from "framer-motion";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { GetServerSideProps } from "next";
import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";
export default function Login() {
  return (
    <m.div exit={{ opacity: 0 }}>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="flex h-1/2 flex-col items-center justify-center gap-4 bg-black md:h-full md:w-1/2">
          <Tile letters={"66"} />
          <Tile letters="WORDZ" />
        </div>
        <div className="relative flex h-1/2 flex-col items-center justify-center gap-48 bg-white font-bold md:h-full md:w-1/2">
          <div className="flex items-center gap-10">
            <SignInButton>
              <button className=" rounded-md border-2 border-[#9462C6] bg-black px-4 text-[4vh] text-white duration-150 ease-in-out hover:bg-zinc-700">
                SIGN IN
              </button>
            </SignInButton>
          </div>
          <div className=" absolute bottom-2 flex w-full justify-around text-sm text-zinc-600">
            <Link className="... w-1/5 truncate" href="terms-of-service">
              Terms of Service
            </Link>
            <Link className="... w-1/5 truncate" href="privacy">
              Privacy Policy
            </Link>
            <Link className="... w-1/5 truncate" href="refund">
              Refund Policy
            </Link>
            <div className=" w-1/5">
              <p className="... truncate">
                Contact:hosanna_golfers_0o@icloud.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient().users.getUser(userId) : undefined;
  if (userId) {
    // send user to index
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { ...buildClerkProps(ctx.req, { user }) } };
};
