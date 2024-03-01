import { motion } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Image from "next/image";
import bot from "../../../public/bot.svg";
import { AutoAttackOption } from "./survival";

type OpponentProps = {
  playerId: string;
  opponentData?: {
    health: number;
    shield: number;
    eliminated: boolean;
    initials?: string;
  };
  opponentCount: number;
  setAutoAttack: (autoAttack: AutoAttackOption) => void;
  autoAttack: AutoAttackOption;
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
      }}
      exit={{ scale: 0 }}
      className={`${
        eliminated ? "cursor-not-allowed opacity-50" : "opacity-100"
      } m-1 flex min-w-14 items-center justify-start`}
    >
      <div
        onClick={() => props.setAutoAttack(props.playerId)}
        className={`w-full rounded-full duration-150 ease-in-out ${props.autoAttack === props.playerId && "bg-violet-300"}`}
      >
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: "#57E98F",
            textColor: "black",
            strokeLinecap: "round",
            trailColor: "#d3d3d3",
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
