import Image from "next/image";
import { GameType } from "@prisma/client";
import info from "../../public/info.svg";
import { m } from "framer-motion";
type GameCardProps = {
  gameType: GameType;
  gameImage: string;
  gameAlt: string;
  quickPlay: (gameMode: GameType) => void;
  handleDescription: (
    gameMode: GameType,
    rules: { [header: string]: string[] },
  ) => void;
  rules: { [header: string]: string[] };
  setIsCreateLobby: (isCreateLobby: boolean) => void;
  setIsJoinLobby: (isJoinLobby: boolean) => void;
  isPremiumUser?: Boolean;
};

const GameCard: React.FC<GameCardProps> = (props: GameCardProps) => {
  return (
    <m.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="relative flex w-44 flex-col flex-wrap items-center  justify-center rounded-md bg-zinc-800 py-4 text-white"
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
              props.setIsCreateLobby(true);
            }}
            className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 py-1 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
          >
            Create
          </button>
        )}
        <button
          onClick={() => {
            props.setIsJoinLobby(true);
          }}
          className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 py-1 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
        >
          Join
        </button>
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
