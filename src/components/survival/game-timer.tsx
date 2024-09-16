import { useTimer } from "react-timer-hook";

const GameTimer: React.FC<{ timer: number }> = ({ timer, ...props }) => {
  const { totalSeconds, restart } = useTimer({
    expiryTimestamp: new Date(timer),
    autoStart: true,
  });

  const calculatedSeconds = () => {
    const calculatedSeconds = (new Date().getTime() - timer) / 1000;
    const progress = (calculatedSeconds / totalSeconds ) * 100;

    console.log(progress);

    return progress;
  };

  return (
    <div
      style={{ width: `${calculatedSeconds()}%` }}
      className="h-2 rounded-full bg-emerald-400 ease-in-out"
    ></div>
  );
};

export default GameTimer;
