import Image from "next/image";
import challenge from "../../public/challenge.png";
type ChallengeCardProps = {};

const ChallengeCard: React.FC = (props) => {
  return (
    <div className=" bg-card text-card-foreground h-full prose w-full max-w-xs rounded-lg border-2 border-zinc-200 shadow-sm">
      <div className="flex flex-col items-center">
        <Image
          className="mb-0"
          src={challenge}
          alt={`image for challenge game`}
          height={20}
        />
        <div className="flex w-full flex-col space-y-1.5 px-6 pb-6">
          <div>
            <h3 className="mb-0">Challenge</h3>
            <p className="hidden text-sm text-gray-500 sm:block">
              Challenge a friend to see who can uncover a word faster
            </p>
          </div>

          <button className=" w-full rounded-md bg-zinc-900 py-2 font-semibold text-white duration-150 ease-in-out hover:bg-zinc-700">
            Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
