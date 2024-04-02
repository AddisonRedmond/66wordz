import Image, { StaticImageData } from "next/image";
import { GameType } from "@prisma/client";
import info from "../../public/info.svg";
import { m } from "framer-motion";
type GameCardProps = {
  gameType: GameType;
  gameImage: StaticImageData;
  gameAlt: string;
  quickPlay: (gameMode: GameType) => void;
  handleDescription: (
    gameMode: GameType,
    rules: { [header: string]: string[] },
  ) => void;
  rules: { [header: string]: string[] };
  isPremiumUser?: boolean;
  enableCreateLobby: (gameType: GameType) => void;
};

const GameCard: React.FC<GameCardProps> = (props: GameCardProps) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex w-48 flex-col flex-wrap items-center  justify-center rounded-md bg-zinc-800 py-4 text-white"
    >
      <h2 className=" mt-2 text-xl font-semibold">{props.gameType}</h2>
      <div className=" grid h-24 content-center ">
        <Image
          width={50}
          height={50}
          src={props.gameImage}
          alt={props.gameAlt}
        />
      </div>

      <div className="grid place-content-center gap-2">
        <button
          onClick={() => {
            props.quickPlay(props.gameType);
          }}
          className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 py-1 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
        >
          Quick Play
        </button>
        {props.isPremiumUser && (
          <button
            onClick={() => {
              props.enableCreateLobby(props.gameType);
            }}
            className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 py-1 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
          >
            Create
          </button>
        )}
      </div>
      <Image
        onClick={() => props.handleDescription(props.gameType, props.rules)}
        className="absolute right-1 top-1 cursor-pointer"
        width={20}
        src={info}
        alt={"Info icon"}
        title="show instructions for game"
      />
    </m.div>
  );
};

export default GameCard;
