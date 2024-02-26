import { motion, useAnimate } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { PlayerData } from "~/utils/survival/surivival";
import bot from "../../../public/bot.svg";
import Image from "next/image";
type MobileAttackProps = {
  setIsAttack: (value: boolean) => void;
  players: PlayerData;
  userId: string;
  attack: (playerId: string, func?: () => void) => void;
};

const MobileAttack: React.FC<MobileAttackProps> = (
  props: MobileAttackProps,
) => {
  const [scope, animate] = useAnimate();

  const attackStrength = (attackStrength: number) => {
    if (attackStrength < 10 || attackStrength > 100) {
      throw new Error("Input number must be between 10 and 100");
    }

    const scaleArray: number[] = [];

    for (let i = 0; i < 5; i++) {
      scaleArray.push(1 + attackStrength / 150);
      scaleArray.push(0.75);
    }

    scaleArray.push(1);

    return scaleArray;
  };

  const attacked = (playerId: string) => {
    if (scope.current && !props.players?.[playerId]?.eliminated) {
      animate(
        scope.current,
        {
          scale: attackStrength(props.players[props.userId]?.attack ?? 0),
        },
        { duration: 0.65 },
      );
    }
  };

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-gray-400 bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.dialog
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        open={true}
        className="relative z-50 m-auto  flex h-5/6 w-[80vw] flex-col items-center justify-between rounded-md py-2"
      >
        <div className=" flex h-5/6 flex-wrap justify-center gap-2 overflow-auto">
          {Object.keys(props.players).map((player: string) => {
            if (player !== props.userId) {
              return (
                <motion.div
                  onClick={() => props.attack(player, () => attacked(player))}
                  key={player}
                  className="aspect-square w-1/5"
                  style={{ position: "relative" }}
                  ref={scope}
                >
                  <CircularProgressbarWithChildren
                    styles={buildStyles({
                      pathColor: "#57E98F",
                      textColor: "black",
                    })}
                    value={props?.players[player]?.health ?? 0}
                    strokeWidth={10}
                  >
                    <CircularProgressbarWithChildren
                      styles={buildStyles({
                        pathColor: "#1E8BE1",
                        textColor: "black",
                        trailColor: "transparent",
                      })}
                      strokeWidth={10}
                      value={props?.players[player]?.shield ?? 0}
                    >
                      <div className=" flex flex-col items-center justify-center font-semibold">
                        {props.players[player]?.eliminated ? (
                          <p>❌</p>
                        ) : (
                          <>
                            {props.players[player]?.initials ? (
                              <p>{props.players[player]?.initials}</p>
                            ) : (
                              <div className={`aspect-square`}>
                                <Image alt="robot icon" width={20} src={bot} />
                              </div>
                            )}
                            {/* <p className="text-sm text-sky-400">{shield}</p>
                        <p className="text-sm text-green-400">{health}</p> */}
                          </>
                        )}
                      </div>
                    </CircularProgressbarWithChildren>
                  </CircularProgressbarWithChildren>
                </motion.div>
              );
            }
          })}
        </div>
        <button
          onClick={() => props.setIsAttack(false)}
          className="mt-2 w-4/6 rounded-md bg-zinc-600 p-2 font-semibold text-white"
        >
          Close
        </button>
      </motion.dialog>
    </motion.div>
  );
};

export default MobileAttack;
