import { useTimer } from "react-timer-hook";
import Tile from "../tile";

type CountDownTimerProps = {
  expiryTimestamp?: number;
  timerTitle: string;
};

const CountDownTimer: React.FC<CountDownTimerProps> = (props) => {
  const expiryTimestamp = new Date(props?.expiryTimestamp ?? Date.now());
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  if (!props.expiryTimestamp) {
    return <p>Timer not set</p>;
  } else {
    return (
      <div className="text-center font-semibold">
        <p className="text-lg">{props.timerTitle}</p>

        <div className="mt-2 flex justify-center gap-2">
          <div className="flex flex-col items-center">
            <Tile
              bg="bg-zinc-800"
              letters={`${totalSeconds < 10 ? "0" : ""}${totalSeconds}`}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default CountDownTimer;
