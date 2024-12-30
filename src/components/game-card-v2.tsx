import { GameType } from "@prisma/client";
import Image from "next/image";
type GameCardV2Props = {
  gameType: GameType;
  image: string;
  fullAccess: boolean;
  quickPlay: (gameMode: GameType) => void;
  handleUpgrade: () => void;
  desc: string;
  disabled?: boolean;
  handleInstructions: (gameType: GameType) => void;
};

const GameCardV2: React.FC<GameCardV2Props> = (props) => {
  return (
    <div
      style={props.disabled ? { opacity: "50%" } : {}}
      className="bg-card text-card-foreground prose flex h-60 w-1/4 min-w-64 flex-col rounded-lg px-6 py-5 shadow-md outline outline-1 outline-zinc-300"
    >
      <div className="flex h-fit justify-between">
        <span className="size-7">
          <Image
            unoptimized
            className="m-0"
            src={props.image}
            alt={`image for ${props.gameType} game`}
            width={30}
            height={30}
          />
        </span>
        <button
          onClick={() => props.handleInstructions(props.gameType)}
          className="grid size-7 place-content-center rounded-full outline outline-1 outline-zinc-300 duration-150 ease-in-out hover:bg-zinc-100"
        >
          <Image
            unoptimized
            className="m-0"
            src={
              "https://utfs.io/f/e8LGKadgGfdI8zEB08Ls0HGm1zJCvT6f9KpclUtM7kZ2jOBR"
            }
            alt={`image for ${props.gameType} game`}
            width={4}
            height={18}
          />
        </button>
      </div>

      <div className="flex w-full flex-grow flex-col justify-between space-y-1.5">
        <div>
          <h3 className="mb-0">{props.gameType}</h3>
          <p className="hidden text-sm text-gray-500 sm:block">{props.desc}</p>
        </div>

        {props.disabled && <p>Desktop only for now</p>}

        <button
          onClick={() => {
            if (!props.disabled) {
              props.quickPlay(props.gameType);
            }
          }}
          className="w-full rounded-md bg-zinc-900 py-2 font-semibold text-white duration-150 ease-in-out hover:bg-zinc-700"
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
