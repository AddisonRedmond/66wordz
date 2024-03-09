import { useTimer } from "react-timer-hook";
import Tile from "../tile";

type LoadingGameProps = {
  expiryTimestamp: Date;
  gameOwner?: string;
  isGameOwner?: boolean;
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
      {props.isGameOwner && <button className=" bg-zinc-800 ease-in-out duration-150 hover:bg-zinc-600 text-white rounded-full p-2 my-3">Start Game</button>}
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
