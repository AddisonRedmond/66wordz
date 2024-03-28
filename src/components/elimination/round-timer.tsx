import { useTimer } from "react-timer-hook";

type RoundTimerProps = {
  expiryTimeStamp: number;
};

const RoundTimer: React.FC<RoundTimerProps> = (props: RoundTimerProps) => {
  const { seconds, minutes } = useTimer({
    expiryTimestamp: new Date(props.expiryTimeStamp),
    autoStart: true,
  });

  return (
    <div className="flex items-center justify-between text-center text-sm">
      <p className="font-medium">Time Left:</p>
      <p className="font-semibold text-lg">
        {minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)}
      </p>
    </div>
  );
};

export default RoundTimer;
