import { useTimer } from "react-timer-hook";

type GameInfoProps = {
  correctGuesses?: number;
  guesses?: number;
  roundTimer: number;
};

const GameInfo: React.FC<GameInfoProps> = (props) => {
  const { seconds, minutes, restart, start } = useTimer({
    expiryTimestamp: new Date(props.roundTimer),
  });
  return (
    <div className="flex h-16 full min-w-60 items-center">
      <div className="grid aspect-square h-full place-items-center rounded-l-lg border-2 border-zinc-600">
        <p>Points</p>
        <p className="text-xl font-semibold">{props.correctGuesses ?? 0}</p>
      </div>
      <div className="flex h-full w-full flex-col justify-center rounded-r-lg border-2 border-black bg-black px-3 text-white">
        <p className="">Bottom <span className="font-semibold text-green-500">7</span> Will Be Eliminated in</p>
        <p>
          <span className="font-semibold">{minutes} </span>
          <span>min</span> <span className="font-semibold">{seconds} </span>
          <span>sec</span>
        </p>
      </div>
    </div>
  );
};

export default GameInfo;
