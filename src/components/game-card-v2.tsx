import { GameType } from "@prisma/client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
type GameCardV2Props = {
  gameType: GameType;
  image: StaticImport;
  fullAccess?: boolean;
  quickPlay: (gameMode: GameType) => void;
  handleUpgrade: () => void;
  desc: string;
};

const GameCardV2: React.FC<GameCardV2Props> = (props) => {
  return (
    <div className=" bg-card text-card-foreground prose flex h-60 w-1/4  flex-col rounded-lg border-2 border-zinc-200 px-6 py-5 shadow-sm">
      <Image
        className="m-0"
        src={props.image}
        alt={`image for ${props.gameType} game`}
        width={20}
      />
      <div className="flex justify-between w-full flex-col space-y-1.5 flex-grow">
        <div>
          <h3 className="mb-0">{props.gameType}</h3>
          <p className="hidden text-sm text-gray-500 sm:block">{props.desc}</p>
        </div>

        <button
          onClick={() => props.quickPlay(props.gameType)}
          className=" w-full rounded-md bg-zinc-900 py-2 font-semibold text-white duration-150 ease-in-out hover:bg-zinc-700"
        >
          Play
        </button>
        {/* <div className="group relative overflow-hidden">
          {!props.fullAccess && (
            <button
              onClick={() => props.handleUpgrade()}
              className={`absolute z-10 grid h-full w-full translate-y-0 place-content-center rounded-md border-2 bg-[#F1D024] font-semibold opacity-100 duration-150  ease-in-out group-hover:translate-y-0 sm:-translate-y-12`}
            >
              Upgrade to gold
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default GameCardV2;
