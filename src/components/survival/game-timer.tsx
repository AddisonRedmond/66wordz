import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

type GameTimerProps = {
  timer?: number;
  handleExpired: () => void;
};

const GameTimer: React.FC<GameTimerProps> = ({ timer, handleExpired }) => {
  // if the timer is 0, then this component renders out just a "0" with no wrapping element
  const [initialDuration, setInitialDuration] = useState(0);
  const { totalSeconds, restart } = useTimer({
    expiryTimestamp: new Date(timer!),
    autoStart: true,
    onExpire: () => handleExpired(),
  });

  useEffect(() => {
    // Calculate the initial duration in seconds
    if (!timer) {
      return;
    }
    const totalInitialSeconds = (timer - new Date().getTime()) / 1000;
    restart(new Date(timer));

    setInitialDuration(totalInitialSeconds);
  }, [timer]);

  const progress = () => {
    const calculatedProgress = (totalSeconds / initialDuration) * 100;
    // Ensure progress is valid and returns 0 if NaN or negative
    return Math.max(0, isNaN(calculatedProgress) ? 0 : calculatedProgress);
  };

  const calculateHue = (
    totalSeconds: number,
    initialDuration: number,
  ): number => {
    if (initialDuration <= 0) {
      return 0;
    }
    const progress = (totalSeconds / initialDuration) * 100;
    const hue = (1 - progress / 100) * 180;
    return Math.max(0, Math.min(360, hue));
  };

  return (
    <div>
      <div
        style={{
          width: `${progress()}%`,
          filter: `hue-rotate(${calculateHue(totalSeconds, initialDuration)}deg)`,
        }}
        className={`h-1 rounded-full bg-cyan-400 duration-1000 ease-linear`}
      ></div>
    </div>
  );
};

export default GameTimer;
