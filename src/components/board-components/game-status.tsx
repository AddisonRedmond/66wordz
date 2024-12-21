import { useTimer } from "react-timer-hook";
import Image from "next/image";
import { useEffect } from "react";
type GameStatusProps = {
  qualified: number;
  endTime: number;
  totalSpots: number;
  round: number;
  finalRound: boolean;
};

const GameStatus: React.FC<GameStatusProps> = (props) => {
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(props.endTime),
  });

  useEffect(() => {
    restart(new Date(props.endTime));
  }, [props.endTime]);

  return (
    <div className="flex w-full items-center justify-around py-2 font-semibold">
      <div className="w-1/3 text-center">
        <p className="text-xs">Qualified</p>
        <p>{`${props.qualified}/${props.finalRound ? "1" : props.totalSpots}`}</p>
      </div>
      <div className="w-1/3 text-center">
        <p>Round</p>
        <p>{props.round}</p>
      </div>

      <div className="grid w-1/3 place-items-center text-lg">
        <Image
          unoptimized
          src="https://utfs.io/f/e8LGKadgGfdIj6AGUvybY5N3wIvPhWRso1lep8jrEmnVxTQf"
          height={15}
          width={15}
          alt="stop watch image"
          title="Time left before eliminated"
        />
        <p>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
    </div>
  );
};

export default GameStatus;
