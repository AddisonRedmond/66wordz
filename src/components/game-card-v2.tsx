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
};

const GameCardV2: React.FC<GameCardV2Props> = (props) => {
  return (
    <div
      style={props.disabled ? { opacity: "50%" } : {}}
      className="bg-card prose flex h-full w-1/5 min-w-64 flex-col rounded-lg px-6 py-5 shadow-md outline outline-1 outline-zinc-300"
    >
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

      <div className="flex w-full flex-grow flex-col justify-between space-y-1.5">
        <div>
          <h3 className="mb-0">{props.gameType}</h3>
          <p
            className="hidden truncate text-sm text-gray-500 sm:block"
            title={props.desc}
          >
            {props.desc}
          </p>
        </div>

        {props.disabled && <p>Desktop only for now</p>}

        <div className="flex flex-col gap-2">
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
          <button
            onClick={() => {
              if (!props.disabled) {
                props.quickPlay(props.gameType);
              }
            }}
            className="w-full rounded-md outline outline-1 py-2 font-semibold duration-150 ease-in-out hover:bg-zinc-200 outline-zinc-400"
          >
            Create
          </button>
        </div>

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
