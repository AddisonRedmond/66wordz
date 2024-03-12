import { useTimer } from "react-timer-hook";
import Tile from "../tile";
type LoadingGameProps = {
  expiryTimestamp: Date;
  gameOwner?: string;
  isGameOwner?: boolean;
  startGame: () => void;
  playerCount: number;
  exitMatch: () => void;
};
const LoadingGame: React.FC<LoadingGameProps> = ({
  expiryTimestamp,
  gameOwner,
  ...props
}: LoadingGameProps) => {
  if (gameOwner) {
    return (
      <div className="text-center font-semibold">
        <p className="text-lg">Waiting for players . . .</p>
        <p className="text-lg">"2 player minimum"</p>
        {props.isGameOwner && (
          <div className="flex flex-col">
            <button
              onClick={() => {
                props.playerCount >= 2 && props.startGame();
              }}
              className={`my-3 rounded-full bg-zinc-800 p-2 text-white duration-150 ease-in-out hover:bg-zinc-600 ${props.playerCount >= 2 ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              Start Game
            </button>
            <button
              className={`rounded-full border-2 border-zinc-800 bg-white p-2 text-black  duration-150 ease-in-out hover:bg-zinc-300`}
              onClick={() => props.exitMatch()}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">Game starting in</p>

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
