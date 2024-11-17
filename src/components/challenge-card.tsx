import Image from "next/image";
import challenge from "../../public/challenge.png";
import Link from "next/link";

const ChallengeCard: React.FC = () => {
  return (
    <div className="bg-card text-card-foreground prose flex h-60 w-1/4 min-w-64 flex-col rounded-lg border-2 border-zinc-200 px-6 py-5 shadow-sm">
      <Image
        className="mb-0"
        src={challenge}
        alt={`image for game`}
        height={20}
      />
      <div className="flex w-full flex-grow flex-col justify-between space-y-1.5">
        <div>
          <h3 className="mb-0">Challenge</h3>
          <p className="hidden text-sm text-gray-500 sm:block">
            Challenge a friend or friends to see who can uncover a word faster
          </p>
        </div>

        <Link href="/challenges">
          <button className="w-full rounded-md bg-zinc-900 py-2 font-semibold text-white duration-150 ease-in-out hover:bg-zinc-700">
            Challenges
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;
