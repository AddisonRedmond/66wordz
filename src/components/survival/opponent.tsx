import { motion } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

type OpponentProps = {
  playerId: string;
  opponentData?: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
  };
  attack: (playerId: string) => void;
  opponentCount: number;
};

const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  const { health, shield, eliminated } = props.opponentData ?? {
    health: 0,
    shield: 0,
    eliminated: false,
  };

  const opponentSizePercentage = 50 / Math.sqrt(props?.opponentCount ?? 0); // Using the square root for both width and height
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        width: `${opponentSizePercentage}%`,
        minWidth: "55px",
      }}
      exit={{ scale: 0 }}
      onClick={() => {
        props.attack(props.playerId);
      }}
      className={`${eliminated ? "opacity-50" : "opacity-100"} aspect-square m-1`}
    >
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathColor: "#38BDF8",
          textSize: "50px",
          textColor: "black",
        })}
        value={shield}
      >
        <div className="w-10/12">
          <CircularProgressbarWithChildren
            styles={buildStyles({
              pathColor: "#4ADE80",
              textSize: "50px",
              textColor: "black",
            })}
            value={health}
          >
            <div className="flex flex-col items-center justify-center font-semibold">
              {eliminated ? (
                <p>❌</p>
              ) : (
                <>
                  <p className="text-sm text-sky-400">{shield}</p>
                  <p className="text-sm text-green-400">{health}</p>
                </>
              )}
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </CircularProgressbarWithChildren>
    </motion.div>
  );
};

export default Opponent;
