import { useTimer } from "react-timer-hook";

type GameStatusProps = {
  qualified: number;
  endTime: number;
  totalSpots: number;
};

const GameStatus: React.FC<GameStatusProps> = (props) => {
  const { seconds, minutes } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(props.endTime),
  });


  return (
    <div className="flex h-14 w-60 rounded-md border-2">
      <div className="grid h-full w-1/3 place-items-center rounded-l-md bg-zinc-700">
        <p className=" text-lg text-white">{`${props.qualified} of ${props.totalSpots}`}</p>
      </div>
      <div className="grid w-2/3 place-items-center text-lg font-semibold">
        <p>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
    </div>
  );
};

export default GameStatus;
