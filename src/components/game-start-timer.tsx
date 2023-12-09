import { useTimer } from "react-timer-hook";
import Tile from "./tile";

type GameStartTimeProps = {
  expiryTimestamp: Date;
  handleTimerEnd?: () => void;
};
const GameStartTimer: React.FC<GameStartTimeProps> = ({
  expiryTimestamp,
  handleTimerEnd,
}: GameStartTimeProps) => {
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => (handleTimerEnd ? handleTimerEnd() : undefined),
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">{`Game starting in`}</p>
      <div className="mt-2 flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <Tile letters={`${totalSeconds}`} />
        </div>
      </div>
    </div>
  );
};

export default GameStartTimer;
