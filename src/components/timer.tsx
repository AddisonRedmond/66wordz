import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type TimerProps = {
  expiryTimestamp: Date;
  endGame?: () => void;
};

const Timer: React.FC<TimerProps> = ({
  expiryTimestamp,
  endGame,
}: TimerProps) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.log( "timer ended"),
  });

  useEffect(() => {
    restart(expiryTimestamp);
  }, [expiryTimestamp]);

  const toTotalSeconds = (mins: number, seconds: number) => {
    const totalSeconds = mins * 60 + seconds;

    const progress = (totalSeconds / 180) * 100;

    return progress > 100 ? 100 : progress;
  };

  return (
    <div className="flex flex-col justify-center text-2xl font-semibold my-3">
      {true && (
        <div className="mx-1 text-black">
          <span>{minutes} Mins</span> <span>{seconds} Secs</span>
        </div>
      )}
      <div className="h-1 w-[100%] bg-white">
        <div
          className="ease-in-out rounded-full"
          style={{
            width: `${toTotalSeconds(minutes, seconds)}%`,
            height: "10px",
            backgroundColor: "green",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
