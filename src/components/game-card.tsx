import Image from "next/image";
import { GameType } from "@prisma/client";
import info from "../../public/info.svg";

type GameCardProps = {
  gameType: GameType;
  gameImage: string;
  gameAlt: string;
  joinGame: (gameMode: GameType) => void;
  handleDescription: (gameMode: GameType, rules: any) => void;
  rules: any;
};

const GameCard: React.FC<GameCardProps> = (props: GameCardProps) => {
  return (
    <div className="relative flex w-36 flex-col flex-wrap items-center  justify-center rounded-md bg-zinc-800 py-4 text-white">
      <h2 className=" mt-2 text-xl font-semibold">{props.gameType}</h2>
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
          props.joinGame(props.gameType);
        }}
        className="rounded-full border-2 border-[#DECEED] bg-zinc-800 px-4 font-semibold duration-150 ease-in-out hover:bg-white hover:text-black"
      >
        Play
      </button>
      <Image
        onClick={() => props.handleDescription(props.gameType, props.rules)}
        className="absolute right-1 top-1 cursor-pointer"
        width={20}
        src={info}
        alt={"Info icon"}
        title="show instructions for game"
      />
    </div>
  );
};

export default GameCard;
