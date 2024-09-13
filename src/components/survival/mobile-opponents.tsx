import { SurvivalPlayerData } from "~/utils/survival/surivival";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { m } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

type MobileOpponentsProps = {
  opponents?: SurvivalPlayerData;
  setMobileOpponentIsOpen: Dispatch<SetStateAction<boolean>>;
  allPlayers: SurvivalPlayerData;
  attackPosition: string;
  setAttackPosition: (id: string) => void;
};

const MobileOpponents: React.FC<MobileOpponentsProps> = (props) => {
  const MAX_HEALTH = 2;
  const MAX_SHIELD = 4;
  
  return (
    <m.div
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-gray-400 bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <m.dialog
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        open={true}
        className="relative z-50 m-auto  flex h-5/6 w-[80vw] flex-col items-center justify-between rounded-md py-2"
      >
        <div className="flex h-full w-full flex-col items-center">
          <p className="h-[10%] font-semibold">All Players</p>
          <div className="flex w-full flex-grow flex-wrap justify-between gap-y-1 overflow-scroll px-1">
            {Object.keys(props.allPlayers).map((playerId: string) => {
              if (!props.allPlayers[playerId]?.eliminated) {
                return (
                  <div
                    key={playerId}
                    className="size-14"
                    onClick={() => {
                      props.setAttackPosition(playerId);
                    }}
                  >
                    <CircularProgressbarWithChildren
                      value={
                        (props.allPlayers[playerId]!.health / MAX_HEALTH) * 100
                      }
                      styles={buildStyles({
                        pathColor: "#57E98F",
                        textColor: "black",
                        strokeLinecap: "round",
                        trailColor: "#d3d3d3",
                        pathTransitionDuration: 0.5,
                        backgroundColor: "#d1d5db",
                      })}
                      background={props.attackPosition === playerId}
                      strokeWidth={11}
                    >
                      <div className="h-full w-full">
                        <CircularProgressbarWithChildren
                          value={
                            (props.allPlayers[playerId]!.shield / MAX_SHIELD) *
                            100
                          }
                          styles={buildStyles({
                            pathColor: "#1E8BE1",
                            textColor: "black",
                            trailColor: "transparent",
                            strokeLinecap: "round",
                            pathTransitionDuration: 0.5,
                          })}
                          strokeWidth={11}
                        >
                          <div>
                            <p className="text-xs font-medium">
                              {props.allPlayers[playerId]?.initials ?? "N/A"}
                            </p>
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                );
              }
            })}
          </div>
          <div className="h-[10%]">
            <button
              onClick={() => props.setMobileOpponentIsOpen(false)}
              className="w-fit rounded-md border-2 p-2"
            >
              Close
            </button>
          </div>
        </div>
      </m.dialog>
    </m.div>
  );
};

export default MobileOpponents;
