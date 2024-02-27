import { motion, useAnimate } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Image from "next/image";
import bot from "../../../public/bot.svg";

type OpponentProps = {
  playerId: string;
  opponentData?: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
    initials?: string;
  };
  attack: (playerId: string, func?: () => void) => void;
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

  const attackStrength = (attackStrength: number) => {
    const scaleArray: number[] = [];

    for (let i = 0; i < 5; i++) {
      scaleArray.push(1 + attackStrength / 150);
      scaleArray.push(0.75);
    }

    scaleArray.push(1);

    return scaleArray;
  };

  const attacked = () => {
    if (scope.current && !props.opponentData?.eliminated) {
      animate(
        scope.current,
        {
          scale: attackStrength(props.attackValue ?? 0),
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
      }}
      exit={{ scale: 0 }}
      onClick={() => {
        props.attack(props.playerId, attacked);
      }}
      className={`${
        eliminated ? "cursor-not-allowed opacity-50" : "opacity-100"
      } m-1 flex aspect-square min-w-14 items-center justify-start`}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: "#57E98F",
            textColor: "black",
            strokeLinecap: "round",
            pathTransitionDuration: 0.5,
          })}
          value={health}
          strokeWidth={10}
        >
          <div className="h-full w-full">
            <CircularProgressbarWithChildren
              styles={buildStyles({
                pathColor: "#1E8BE1",
                textColor: "black",
                trailColor: "transparent",
                strokeLinecap: "round",
                pathTransitionDuration: 0.5,
              })}
              strokeWidth={10}
              value={shield}
            >
              <div className=" flex flex-col items-center justify-center font-semibold">
                {eliminated ? (
                  <p>❌</p>
                ) : (
                  <>
                    {props.opponentData?.initials ? (
                      <p className={`text-[1vw]`}>
                        {props.opponentData?.initials}
                      </p>
                    ) : (
                      <div className={`aspect-square h-[1vw]`}>
                        <Image alt="robot icon" src={bot} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </motion.div>
  );
};

export default Opponent;
