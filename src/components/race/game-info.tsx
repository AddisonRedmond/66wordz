import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import Image from "next/image";
import { getOrinalSuffix } from "~/utils/race";
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
  return (
    <div className="flex items-center justify-around p-2 font-semibold">
      <div className="grid place-content-center text-center text-custom-accent">
        <p>pts</p>
        <p className="text-xl font-semibold">{correctGuesses}</p>
      </div>
      <div
        className="flex flex-col items-center justify-center duration-150 ease-in-out"
        style={{
          color:
            props.placement <= props.numberOfPlayersToEliminate
              ? "#059212"
              : "#DF2E38",
        }}
      >
        <p>#</p>
        <p>{`${getOrinalSuffix(props.placement)}`}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="aspect-square">
          <Image
            src="https://utfs.io/f/e8LGKadgGfdIj6AGUvybY5N3wIvPhWRso1lep8jrEmnVxTQf"
            unoptimized
            height={15}
            width={15}
            alt="stop watch image"
            title="Time left before eliminated"
          />
        </span>
        <p className="font-semibold">
          {`${minutes}:${seconds.toString().padStart(2, "0")}`}
        </p>
      </div>
    </div>
  );
};

export default GameInfo;
