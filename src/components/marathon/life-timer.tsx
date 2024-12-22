import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

const LifeTimer: React.FC<{ endTime: number; small?: boolean }> = ({
  endTime,
  small = false,
}) => {
  const [initialTime, setInitialTime] = useState<number>(
    new Date(endTime).getTime() - new Date().getTime(),
  );
  const { totalSeconds, restart } = useTimer({
    expiryTimestamp: new Date(endTime),
  });

  useEffect(() => {
    setInitialTime(new Date(endTime).getTime() - new Date().getTime());
    restart(new Date(endTime));
  }, [endTime]);

  const calcualteTimeRemaining = () => {
    return (totalSeconds / 180) * 100;
  };

  return (
    <div className={`block ${small ? "h-1" : "h-2"}`}>
      <div
        style={{ width: `${calcualteTimeRemaining()}%` }}
        // slowly change timer from green to red as it gets lower
        className="h-full w-1/4 rounded-full bg-emerald-300 duration-1000 ease-linear"
      ></div>
    </div>
  );
};

export default LifeTimer;
