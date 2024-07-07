import { useTimer } from "react-timer-hook";
import Tile from "../tile";

type GameStartingProps = {
  expiryTimestamp: number;
};

const GameStarting: React.FC<GameStartingProps> = (props) => {
  const expiryTimestamp = new Date(props.expiryTimestamp);
  const { totalSeconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
  });
  return (
    <div className="text-center font-semibold">
      <p className="text-lg">Game starting in</p>

      <div className="mt-2 flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <Tile
            bg="bg-zinc-800"
            letters={`${totalSeconds < 10 ? "0" : ""}${totalSeconds}`}
          />
        </div>
      </div>
    </div>
  );
};

export default GameStarting;
