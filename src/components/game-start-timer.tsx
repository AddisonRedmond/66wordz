import { useTimer } from "react-timer-hook";
import Tile from "./tile";

type GameStartTimeProps = {
  expiryTimestamp: Date;
};
const GameStartTimer: React.FC<GameStartTimeProps> = ({
  expiryTimestamp,
}: GameStartTimeProps) => {
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  return (
    <div className="text-center font-semibold">
      <p>{`Game starting in`}</p>
      <div className="flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <Tile letters={`${totalSeconds}`} />
        </div>
      </div>
    </div>
  );
};

export default GameStartTimer;
