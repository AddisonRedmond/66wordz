import { motion, useAnimate } from "framer-motion";
import {
  CircularProgressbarWithChildren,
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
  attack: (playerId: string, func: () => void) => void;
  attackValue?: number;
  opponentCount: number;
};

const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  const [scope, animate] = useAnimate();

  const { health, shield, eliminated } = props.opponentData ?? {
    health: 0,
    shield: 0,
    eliminated: false,
  };

  const attackStrength = (inputNumber: number, axis: "x" | "y") => {
    console.log(inputNumber);
    const half = inputNumber / 16;
    const resultArray: number[] = [];
    if (axis === "x") {
      for (let i = 0; i < 4; i++) {
        resultArray.push(half, -half, 0);
      }
    } else if (axis === "y") {
      resultArray.push(0, half, -half);
    }

    resultArray.push(0);

    return resultArray;
  };

  const attacked = () => {
    if (scope.current) {
      animate(
        scope.current,
        {
          x: attackStrength(props.attackValue ?? 10, "x"),
          y: attackStrength(props.attackValue ?? 10, "y"),
          scale: [1, 1.1, 1, 1, 1.1, 1, 1, 1, 1.1, 1, 1, 1, 1.1, 1, 1, 1],
        },
        { duration: 0.65 },
      );
    }
  };

  const opponentSizePercentage = 50 / Math.sqrt(props?.opponentCount ?? 0); // Using the square root for both width and height
  return (
    <motion.div
      ref={scope}
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        width: `${opponentSizePercentage}%`,
        minWidth: "55px",
      }}
      exit={{ scale: 0 }}
      onClick={() => {
        props.attack(props.playerId, attacked);
      }}
      className={`${
        eliminated ? "opacity-50" : "opacity-100"
      } m-1 flex aspect-square items-center justify-start`}
    >
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathColor: "#4ADE80",
          textSize: "50px",
          textColor: "black",
          trailColor: "",
        })}
        value={health}
      >
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: "#38BDF8",
            textSize: "50px",
            textColor: "black",
            trailColor: "transparent",
          })}
          value={shield}
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
      </CircularProgressbarWithChildren>
    </motion.div>
  );
};

export default Opponent;
