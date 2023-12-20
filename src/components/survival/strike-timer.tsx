import { useTimer } from "react-timer-hook";

type StrikeTimerProps = {
  expiryTimestamp?: number;
};

const StrikeTimer: React.FC<StrikeTimerProps> = (props: StrikeTimerProps) => {
  if (!props.expiryTimestamp) return <p>No Timer</p>;
  
  const { minutes, seconds } = useTimer({
    expiryTimestamp: new Date(props.expiryTimestamp),
  });

  return (
    <div>
      <p>{`Next Strike - ${minutes}:${seconds}`}</p>
    </div>
  );
};

export default StrikeTimer;
