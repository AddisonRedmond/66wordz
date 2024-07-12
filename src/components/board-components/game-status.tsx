import { useTimer } from "react-timer-hook";
import { getQualified } from "~/utils/elimination";

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

  function getOrdinalSuffix(num: number): string {
    const remainder = num % 100;
    if (remainder >= 11 && remainder <= 13) {
      return `${num}th`;
    }

    switch (num % 10) {
      case 1:
        return `${num}st`;
      case 2:
        return `${num}nd`;
      case 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  }
  return (
    <div className="flex h-14 w-60 rounded-md border-2">
      <div className="grid h-full w-1/4 place-items-center rounded-l-md bg-zinc-700">
        <p className=" text-2xl text-white">{`${props.qualified}/${props.totalSpots}`}</p>
      </div>
      <div className="grid w-full place-items-center text-lg font-semibold">
        <p>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
    </div>
  );
};

export default GameStatus;
