import { m } from "framer-motion";
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
};

const SurvivalOpponent: React.FC<SurvivalOpponentProps> = (
  props: SurvivalOpponentProps,
) => {
  const totalOpponents = props.opponents
    ? Object.keys(props?.opponents).length
    : 0;
  const opponentSizePercentage = 50 / totalOpponents; // Using the square root for both width and height

  return (
    <div className="flex flex-grow flex-wrap items-center justify-between px-2">
      {props.opponents &&
        Object.keys(props.opponents).map((opponentId) => {
          const playerData: SurvivalPlayerObject | undefined =
            props.opponents?.[opponentId];
          if (!playerData) {
            return;
          }

          return (
            <m.div
              key={opponentId}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                width: `${opponentSizePercentage}%`,
              }}
              exit={{ scale: 0 }}
              className={`${
                playerData.eliminated
                  ? "cursor-not-allowed opacity-50"
                  : "opacity-100"
              } m-1 flex min-w-14 items-center justify-start`}
            >
              <div
                onClick={() => console.log(opponentId)}
                className={`w-full rounded-full duration-150 ease-in-out ${"bg-violet-300"}`}
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
                      <div className=" flex flex-col items-center justify-center font-semibold">
                        {playerData.eliminated ? (
                          <p>❌</p>
                        ) : (
                          <>
                            {playerData?.initials ? (
                              <p className={`text-[1vw]`}>
                                {playerData?.initials}
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
            </m.div>
          );
        })}
    </div>
  );
};

export default SurvivalOpponent;
