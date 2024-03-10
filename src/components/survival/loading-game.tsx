import { useTimer } from "react-timer-hook";
import Tile from "../tile";

type LoadingGameProps = {
  expiryTimestamp: Date;
  gameOwner?: string;
  isGameOwner?: boolean;
  startGame: () => void;
};
const LoadingGame: React.FC<LoadingGameProps> = ({
  expiryTimestamp,
  gameOwner,
  ...props
}: LoadingGameProps) => {
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">
        {!gameOwner ? "Game starting in" : "Waiting for players . . ."}
      </p>
      {props.isGameOwner && (
        <button
          onClick={() => props.startGame()}
          className=" my-3 rounded-full bg-zinc-800 p-2 text-white duration-150 ease-in-out hover:bg-zinc-600"
        >
          Start Game
        </button>
      )}
      <div className="mt-2 flex justify-center gap-2">
        <div className="flex flex-col items-center">
          {!gameOwner && (
            <Tile
              backgroundColor="bg-zinc-800"
              letters={`${totalSeconds < 10 ? "0" : ""}${totalSeconds}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingGame;
