import { useTimer } from "react-timer-hook";
import Tile from "../tile";
import Carousel from "../carousel/carousel";
import { GameDetails } from "~/utils/types";
import { GameType } from "@prisma/client";

type CountDownTimerProps = {
  expiryTimestamp?: number;
  timerTitle: string;
  gameDetails?: GameDetails;
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
      <div className="flex flex-col gap-y-6 text-center font-semibold">
        <div className="flex flex-col items-center">
          <p className="text-lg">{props.timerTitle}</p>
          <Tile
            bg="bg-zinc-800"
            letters={`${totalSeconds.toString().padStart(2, "0")}`}
          />
        </div>
        <div className="flex flex-col items-center">
          {props.gameDetails && <Carousel slides={props.gameDetails} />}
        </div>
      </div>
    );
  }
};

export default CountDownTimer;
