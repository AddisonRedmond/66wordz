import { useTimer } from "react-timer-hook";

const Intermission: React.FC<{ nextRoundStartTime: number }> = (props) => {
  const { seconds } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(props.nextRoundStartTime),
  });
  return (
    <div>
      <h3>Next Round</h3>
      <p>{`${seconds.toString().padStart(2, "0")}`}</p>
    </div>
  );
};

export default Intermission;
