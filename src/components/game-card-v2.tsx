import { GameType } from "@prisma/client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
type GameCardV2Props = {
  gameType: GameType;
  image: StaticImport;
};

const GameCardV2: React.FC<GameCardV2Props> = (props) => {
  return (
    <div className=" bg-card text-card-foreground prose w-full max-w-sm rounded-lg border-2 border-zinc-400 shadow-sm">
      <div className="flex flex-col items-center">
        <Image
        className="mb-0"
          src={props.image}
          alt="crown image for elimination game"
          width={20}
        />
        <div className="flex w-full flex-col space-y-1.5 px-6 pb-6">
          <div>
            <h3 className="mb-0">{props.gameType}</h3>
            <p className="text-gray-500">
              Outplay your opponents in this round based game
            </p>
          </div>

          <button className=" w-full rounded-md bg-zinc-900 py-2 font-semibold text-white">
            Play
          </button>
          <button className="w-full cursor-not-allowed rounded-md bg-zinc-900 py-2 font-semibold text-white opacity-40">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCardV2;
