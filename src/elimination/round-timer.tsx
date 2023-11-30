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
    <div className="text-center">
      <p>{`Timer Remaining ${minutes} minutes ${seconds} seconds`}</p>
    </div>
  );
};

export default RoundTimer;
