import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

const LifeTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
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
    return (totalSeconds / (initialTime / 1000)) * 100;
  };

  return (
    <div className="block h-2">
      <div
        style={{ width: `${calcualteTimeRemaining()}%` }}
        className="h-full w-1/4 rounded-full bg-emerald-300 duration-1000 ease-linear"
      ></div>
    </div>
  );
};

export default LifeTimer;
