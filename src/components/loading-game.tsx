import { useTimer } from "react-timer-hook";
import Tile from "./tile";
import Image from "next/image";
import copy from "../../public/copy.svg";
import toast, { Toaster } from "react-hot-toast";
type LoadingGameProps = {
  expiryTimestamp: Date;
  gameOwner?: string;
  isGameOwner?: boolean;
  startGame: () => void;
  playerCount: number;
  exitMatch: () => void;
  lobbyId: string;
  startingServer?: boolean;
};

const LoadingCustomGame = (
  props: Omit<LoadingGameProps, "expiryTimestamp">,
) => {
  const notify = () => toast.success("Copied!", { id: "clipboard" });

  return (
    <div className="text-center font-semibold">
      <Toaster />

      <div className="flex items-center justify-center gap-3">
        <p className="text-lg font-semibold">Lobby ID: {props.lobbyId}</p>
        <Image
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(props.lobbyId);
            notify();
          }}
          width={20}
          src={copy}
          alt="Copy Lobby ID"
          title="copy"
        />
      </div>

      <p className="text-lg">
        {props.playerCount - 1}{" "}
        {props.playerCount - 1 === 1 ? "player " : "players "}
        in lobby
      </p>
      {props.isGameOwner && !props.startingServer && (
        <div className="flex flex-col">
          <button
            onClick={() => {
              props.playerCount >= 2 && props.startGame();
            }}
            className={`my-3 rounded-full bg-zinc-800 p-2 text-white duration-150 ease-in-out hover:bg-zinc-600 ${props.playerCount >= 2 ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            Start Game
          </button>
          {/* <button
            className={`rounded-full border-2 border-zinc-800 bg-white p-2 text-black  duration-150 ease-in-out hover:bg-zinc-300`}
            onClick={() => props.exitMatch()}
          >
            Cancel
          </button> */}
        </div>
      )}
    </div>
  );
};

const LoadingQuickPlayGame = (props: LoadingGameProps) => {
  const expiryTimestamp = props.expiryTimestamp;
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">Game starting in</p>

      <div className="mt-2 flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <Tile
            bg="bg-zinc-800"
            letters={`${totalSeconds < 10 ? "0" : ""}${totalSeconds}`}
          />
        </div>
      </div>
    </div>
  );
};

const LoadingGame: React.FC<LoadingGameProps> = ({
  expiryTimestamp,
  gameOwner,
  ...props
}: LoadingGameProps) => {
  if (gameOwner) {
    return <LoadingCustomGame {...props} />;
  }
  return <LoadingQuickPlayGame expiryTimestamp={expiryTimestamp} {...props} />;
};

export default LoadingGame;
