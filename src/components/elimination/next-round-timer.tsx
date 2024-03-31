import { useTimer } from "react-timer-hook";

type NextRoundTimerProps = {
  nextRoundStartTime: number;
};

const NextRoundTimer: React.FC<NextRoundTimerProps> = (
  props: NextRoundTimerProps,
) => {
  const { seconds } = useTimer({
    expiryTimestamp: new Date(props.nextRoundStartTime),
    autoStart: true,
  });
  return (
    <div className="p-4">
      <p className="text-3xl font-semibold">Next Round Starts in</p>
      <p className="text-2xl">{seconds} seconds</p>
    </div>
  );
};

export default NextRoundTimer;
