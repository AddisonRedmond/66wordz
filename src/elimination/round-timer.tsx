import { useTimer } from "react-timer-hook";

type RoundTimerProps = {
  expiryTimestamp: Date;
};

const RoundTimer: React.FC<RoundTimerProps> = ({
  expiryTimestamp,
}: RoundTimerProps) => {
  const { seconds, minutes } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center text-sm sm:text-lg font-semibold mt-4">
      <p className=" text-neutral-600">Time Remaining</p>
      <p>{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</p>
    </div>
  );
};

export default RoundTimer;
