import { useTimer } from "react-timer-hook";
import Tile from "../tile";

type LoadingGameProps = {
  expiryTimestamp: Date;
};
const LoadingGame: React.FC<LoadingGameProps> = ({
  expiryTimestamp,
}: LoadingGameProps) => {
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">{`Game starting in`}</p>
      <div className="mt-2 flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <Tile letters={`${totalSeconds < 10 ? "0" : ""}${totalSeconds}`} />
        </div>
      </div>
    </div>
  );
};

export default LoadingGame;
