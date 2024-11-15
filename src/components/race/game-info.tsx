import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type GameInfoProps = {
  roundTimer: number;
  numberOfPlayersToEliminate: number;
  placement: number;
  correctGuesses?: number;
  guesses?: number;
};

const GameInfo: React.FC<GameInfoProps> = ({
  correctGuesses = 0,
  roundTimer,
  ...props
}) => {
  const { seconds, minutes, restart } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(roundTimer),
  });

  useEffect(() => {
    restart(new Date(roundTimer));
  }, [roundTimer]);

  console.log(props.placement >= props.numberOfPlayersToEliminate)

  return (
    <div className="full flex h-16 min-w-60 items-center">
      <div
        style={{
          backgroundColor:
            props.placement >= props.numberOfPlayersToEliminate
              ? "#FFAAAA": "#ECFFE6"
        }}
        className="grid aspect-square h-full place-items-center rounded-l-lg border-2 border-zinc-600 duration-150 ease-in-out"
      >
        <p>Points</p>
        <p className="text-xl font-semibold">{correctGuesses}</p>
      </div>
      <div className="flex h-full w-full flex-col justify-center rounded-r-lg border-2 border-black bg-black px-3 text-white">
        <p>
          Bottom{" "}
          <span className="font-semibold">
            {props.numberOfPlayersToEliminate}
          </span>{" "}
          Will Be Eliminated in
        </p>
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
