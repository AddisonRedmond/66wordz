import { useTimer } from "react-timer-hook";

type NextRoundTimerProps = {
  expiryTimestamp: Date;
  onEnd: () => void;
};

const NextRoundTimer: React.FC<NextRoundTimerProps> = ({
  expiryTimestamp,
  onEnd,
}: NextRoundTimerProps) => {
  const { seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => onEnd(),
  });
  return (
    <div className="flex flex-col p-10 text-center">
      <h2 className="text-xl font-semibold">Next Round Count Down</h2>
      <p className=" text-zinc-500">The next round will start in:</p>
      <p className="mt-4 text-6xl font-bold">{seconds}</p>
    </div>
  );
};
export default NextRoundTimer;
