import Image from "next/image";

import Link from "next/link";
import CustomImage from "./custom-image";

const ChallengeCard: React.FC = () => {
  const challenge =
    "https://utfs.io/f/e8LGKadgGfdIlLNhM9V2VobYUl65uwdNGWpM7ImPkzsXFtga";
  return (
    <div className="text-card-foreground prose mx-auto flex h-60 w-1/4 min-w-64 flex-col rounded-lg bg-gradient-to-br from-custom-accent to-white px-6 py-5 text-white shadow-md outline outline-1 outline-zinc-300">
      <Image
        unoptimized
        className="mb-0"
        src={challenge}
        alt={`image for game`}
        height={30}
        width={50}
      />
      <div className="flex w-full flex-grow flex-col justify-between space-y-1.5">
        <div className="">
          <h3 className="mb-0">Challenge</h3>
          <p className="hidden text-sm text-black sm:block">
            Challenge a friend or friends to see who can uncover a word faster
          </p>
        </div>
        <Link href="/challenges" className="no-underline">
          <button className="group flex w-full items-center justify-around rounded-md bg-custom-accent py-2 font-semibold text-white decoration-0 duration-150 ease-in-out hover:bg-custom-secondary">
            To Challenges
            <CustomImage
              alt="to challenges"
              src="https://utfs.io/f/e8LGKadgGfdIQN8FJCg7gP0Dwmj4oYf1vdtKbxEASr3kIcVG"
              className="m-0 duration-150 ease-in-out group-hover:scale-125"
              width={20}
              height={20}
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;
