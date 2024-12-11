import { useTimer } from "react-timer-hook";
import Image from "next/image";
type GameStatusProps = {
  qualified: number;
  endTime: number;
  totalSpots: number;
  round: number;
};

const GameStatus: React.FC<GameStatusProps> = (props) => {
  const { seconds, minutes } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(props.endTime),
  });

  return (
    <div className="flex w-full items-center justify-around font-semibold py-2">
      <div className="text-center">
        <p className="text-xs">Qualified</p>
        <p>{`${props.qualified}/${props.totalSpots}`}</p>
      </div>
      <div className="text-center">
        <p>Round</p>
        <p>{props.round}</p>
      </div>

      <div className="grid place-items-center text-lg">
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
