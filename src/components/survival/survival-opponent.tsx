import { m, AnimatePresence } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Image from "next/image";

import bot from "../../../public/bot.svg";

import {
  SurvivalPlayerData,
  SurvivalPlayerObject,
} from "~/utils/survival/surivival";

type SurvivalOpponentProps = {
  opponents?: SurvivalPlayerData;
  setAttackPosition: (id: string) => void;
  attackPosition: string;
  ids: string[];
};

const SurvivalOpponent: React.FC<SurvivalOpponentProps> = (
  props: SurvivalOpponentProps,
) => {
  const totalOpponents = props.ids.length;
  const columns = Math.ceil(Math.sqrt(totalOpponents)); // Calculate the number of columns
  const opponentSizePercentage = 50 / columns; // Each opponent will take up a portion of the row based on the number of columns

  return (
    <div className="flex max-w-full flex-grow flex-wrap items-center justify-evenly gap-1">
      <AnimatePresence>
        {props.opponents &&
          props.ids.map((opponentId) => {
            const playerData: SurvivalPlayerObject | undefined =
              props.opponents?.[opponentId];
            if (!playerData) {
              return null;
            }

            return (
              <m.div
                key={opponentId}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  width: `${opponentSizePercentage}%`,
                  paddingBottom: `${opponentSizePercentage}%`, // To maintain 1:1 aspect ratio
                }}
                exit={{ scale: 0 }}
                className={`relative flex items-center justify-start`}
              >
                <div
                  onClick={() => props.setAttackPosition(opponentId)}
                  className={`absolute left-0 top-0 h-full w-full cursor-pointer rounded-full duration-150 ease-in-out ${
                    props.attackPosition === opponentId
                      ? "bg-zinc-400"
                      : "hover:bg-zinc-300"
                  }`}
                >
                  <CircularProgressbarWithChildren
                    styles={buildStyles({
                      pathColor: "#57E98F",
                      textColor: "black",
                      strokeLinecap: "round",
                      trailColor: "#d3d3d3",
                      pathTransitionDuration: 0.5,
                    })}
                    value={(playerData.health / 2) * 100}
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
                        value={(playerData.shield / 4) * 100}
                      >
                        <div className="flex flex-col items-center justify-center font-semibold">
                          {playerData?.initials ? (
                            <p className={`text-[1vw]`}>
                              {playerData?.initials}
                            </p>
                          ) : (
                            <div className={`aspect-square h-[1vw]`}>
                              <Image alt="robot icon" src={bot} />
                            </div>
                          )}
                        </div>
                      </CircularProgressbarWithChildren>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
              </m.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default SurvivalOpponent;
