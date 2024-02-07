import Image from "next/image";
import { GameType } from "@prisma/client";

type GameCardProps = {
  gameMode: GameType;
  gameImage: string;
  gameAlt: string;
  gameDescription: string;
  joinGame: (gameMode: GameType) => void;
};

const GameCard: React.FC<GameCardProps> = (props: GameCardProps) => {
  return (
    <div className="flex w-36 flex-col flex-wrap items-center justify-center  rounded-md bg-zinc-800 py-4 text-white">
      <h2 className=" text-xl font-semibold">{props.gameMode}</h2>
      <div className=" grid h-24 content-center">
        <Image
          width={50}
          height={50}
          src={props.gameImage}
          alt={props.gameAlt}
        />
      </div>

      <button
        onClick={() => {
          props.joinGame(props.gameMode);
        }}
        className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
      >
        Play
      </button>
    </div>
  );
};

export default GameCard;
