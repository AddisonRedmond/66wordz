import { m } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { SurvivalPlayerData } from "~/utils/survival/surivival";
import bot from "../../../public/bot.svg";
import Image from "next/image";
import { AutoAttackOption } from "./survival";
type MobileAttackProps = {
  players: SurvivalPlayerData;
  userId: string;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setAutoAttack: (autoAttack: AutoAttackOption) => void;
  autoAttack: AutoAttackOption;
};

const MobileAttack: React.FC<MobileAttackProps> = (
  props: MobileAttackProps,
) => {
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
        <div className=" flex h-5/6 flex-wrap justify-center gap-2 overflow-auto">
          {Object.keys(props.players).map((player: string) => {
            if (player !== props.userId) {
              return (
                <m.div
                  key={player}
                  className={`aspect-square h-fit w-1/5 rounded-full duration-150 ease-in-out ${props.autoAttack === player && "bg-violet-300"}`}
                  style={{ position: "relative" }}
                  onClick={() => {
                    props.setAutoAttack(player);
                    props.setMobileMenuOpen(false);
                  }}
                >
                  <CircularProgressbarWithChildren
                    styles={buildStyles({
                      pathColor: "#57E98F",
                      textColor: "black",
                      strokeLinecap: "round",
                      pathTransitionDuration: 0.5,
                    })}
                    value={(props?.players[player]?.health ?? 0 / 2) * 100}
                    strokeWidth={10}
                  >
                    <div className={`h-full w-full`}>
                      <CircularProgressbarWithChildren
                        styles={buildStyles({
                          pathColor: "#1E8BE1",
                          textColor: "black",
                          trailColor: "transparent",
                          strokeLinecap: "round",
                          pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={10}
                        value={(props?.players[player]?.shield ?? 0 / 4) * 100}
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
                                  <Image
                                    alt="robot icon"
                                    width={20}
                                    src={bot}
                                  />
                                </div>
                              )}
                              {/* <p className="text-sm text-sky-400">{shield}</p>
                        <p className="text-sm text-green-400">{health}</p> */}
                            </>
                          )}
                        </div>
                      </CircularProgressbarWithChildren>
                    </div>
                  </CircularProgressbarWithChildren>
                </m.div>
              );
            }
          })}
        </div>
        <button
          onClick={() => props.setMobileMenuOpen(false)}
          className="mt-2 w-4/6 rounded-md bg-zinc-600 p-2 font-semibold text-white"
        >
          Close
        </button>
      </m.dialog>
    </m.div>
  );
};

export default MobileAttack;
