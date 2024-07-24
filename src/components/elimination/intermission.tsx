import { useTimer } from "react-timer-hook";

const Intermission: React.FC<{ nextRoundStartTime: number }> = (props) => {
  const { seconds } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(props.nextRoundStartTime),
  });
  return (
    <div className="p-4 flex flex-col gap-3">
      <h3 className=" text-2xl font-bold">Next Round</h3>
      <p className=" text-xl font-medium">The next round will start in:</p>
      <p className="text-2xl font-semibold">{`${seconds.toString().padStart(2, "0")}`}</p>
    </div>
  );
};

export default Intermission;
