import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

const AboutGold = () => {
  return (
    <div className="flex-grow">
      <div className="flex items-center justify-between p-4">
        <Link href="/login" className="cursor-pointer text-4xl font-semibold">
          66
        </Link>
        <SignInButton>
          <button className="rounded-md bg-black p-2 text-2xl text-white duration-150 ease-in-out hover:bg-zinc-700">
            SIGN IN
          </button>
        </SignInButton>
      </div>
      <main className="prose mx-auto flex max-w-[1000px] flex-grow flex-col">
        <h1>66wordz Gold</h1>
        <h2>What is 66wordz Gold?</h2>

        <p>
          66wordz Gold is a premium subscription service that unlocks exclusive
          features and benefits for our users. Gold unlocks the ability to
          create lobbies, and play unlimited games.
        </p>
      </main>
    </div>
  );
};

export default AboutGold;
