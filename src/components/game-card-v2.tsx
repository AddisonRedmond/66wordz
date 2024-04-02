import { GameType } from "@prisma/client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
type GameCardV2Props = {
  gameType: GameType;
  image: StaticImport;
  fullAccess?: boolean;
  quickPlay: (gameMode: GameType) => void;
  enableCreateLobby: (gameType: GameType) => void;
};

const GameCardV2: React.FC<GameCardV2Props> = (props) => {
  return (
    <div className=" bg-card text-card-foreground prose w-full max-w-xs rounded-lg border-2 border-zinc-200 shadow-sm">
      <div className="flex flex-col items-center">
        <Image
          className="mb-0"
          src={props.image}
          alt={`image for ${props.gameType} game`}
          width={20}
        />
        <div className="flex w-full flex-col space-y-1.5 px-6 pb-6">
          <div>
            <h3 className="mb-0">{props.gameType}</h3>
            <p className="hidden text-sm text-gray-500 sm:block">
              Outplay your opponents in this round based game
            </p>
          </div>

          <button
            onClick={() => props.quickPlay(props.gameType)}
            className=" w-full rounded-md bg-zinc-900 py-2 font-semibold text-white duration-150 ease-in-out hover:bg-zinc-700"
          >
            Play
          </button>
          <button
            onClick={()=> props.enableCreateLobby(props.gameType)}
            className={`w-full duration-150 ease-in-out ${props.fullAccess ? "cursor-pointer opacity-100 hover:bg-zinc-200" : "cursor-not-allowed opacity-25"} rounded-md border-2 border-zinc-500 bg-white py-2 font-semibold text-black`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCardV2;
