import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { WordObject } from "~/utils/survival/surivival";
import { AutoAttackOption } from "./survival";
import Image from "next/image";
import bot from "../../../public/bot.svg";

type PlayerDataWithoutId = {
  health: number;
  shield: number;
  eliminated: boolean;
  initials?: string;
  word: WordObject;
};

type AutoAttackProps = {
  first?: PlayerDataWithoutId;
  last?: PlayerDataWithoutId;
  setAutoAttack: (autoAttack: AutoAttackOption) => void;
  autoAttack: AutoAttackOption;
  setMobileMenuOpen: (isOpen: boolean) => void;
  target?: PlayerDataWithoutId;
};
const MobileAutoAttack: React.FC<AutoAttackProps> = (
  props: AutoAttackProps,
) => {
  const isCustomTarget = () => {
    const isCustomTarget =
      props.autoAttack === "first" ||
      props.autoAttack === "last" ||
      props.autoAttack === "random";
    return !isCustomTarget;
  };
  return (
    <div className="mb-3 h-24 w-full text-center font-semibold">
      <p className="">Attack</p>

      <div className=" flex  w-full items-end justify-around font-semibold">
        <div className="flex aspect-square h-full w-1/6 flex-col items-center justify-end">
          <p>1st</p>
          <div
            onClick={() => props.setAutoAttack("first")}
            className={` aspect-square h-[50px] rounded-full duration-150 ease-in-out ${props.autoAttack === "first" ? "bg-violet-200" : ""}`}
          >
            <CircularProgressbarWithChildren
              styles={buildStyles({
                pathColor: "#57E98F",
                textColor: "black",
                strokeLinecap: "round",
                pathTransitionDuration: 0.5,
              })}
              value={(props?.first?.health ?? 0 / 2) * 100}
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
                  value={(props?.first?.shield ?? 0 / 4) * 100}
                >
                  <div className=" flex flex-col items-center justify-center font-semibold">
                    {props?.first?.eliminated ? (
                      <p>❌</p>
                    ) : (
                      <p>
                        {props?.first?.initials ? props.first.initials : "N/A"}
                      </p>
                    )}
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <div className=" flex aspect-square h-full w-1/6 flex-col items-center justify-end">
          <p>Last</p>
          <div
            onClick={() => props.setAutoAttack("last")}
            className={` aspect-square h-[50px] rounded-full duration-150 ease-in-out ${props.autoAttack === "last" ? "bg-violet-200" : ""}`}
          >
            <CircularProgressbarWithChildren
              styles={buildStyles({
                pathColor: "#57E98F",
                textColor: "black",
                strokeLinecap: "round",
                pathTransitionDuration: 0.5,
              })}
              value={(props?.last?.health ?? 0 / 2) * 100}
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
                  value={((props?.last?.shield ?? 0) / 4) * 100}
                >
                  <div className=" flex flex-col items-center justify-center font-semibold">
                    {props?.last?.eliminated ? (
                      <p>❌</p>
                    ) : (
                      <p>
                        {props?.last?.initials ? props.last.initials : "N/A"}
                      </p>
                    )}
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <div className="grid w-1/6 place-items-center text-center">
          <p>Rand</p>
          <button
            onClick={() => props.setAutoAttack("random")}
            className={` flex aspect-square h-[50px] items-center justify-center rounded-full border-4 border-stone-600 text-lg font-bold text-stone-600 duration-150 ease-in-out ${props.autoAttack === "random" ? "bg-violet-200" : ""}`}
          >
            ???
          </button>
        </div>

        <div className="grid w-1/6 place-items-center text-center">
          <p>Target</p>
          <button
            onClick={() => props.setMobileMenuOpen(true)}
            className={`flex aspect-square h-[50px] items-center justify-center rounded-full border-4 ${isCustomTarget() ? "border-none" : "border-stone-600"} text-lg font-bold text-stone-600 duration-150 ease-in-out ${props.autoAttack === "off" ? "bg-violet-200" : ""}`}
          >
            {/* if autoAttack = a user id show opponent other wise turn it off */}
            {isCustomTarget() ? (
              <div className="relative aspect-square h-full w-full rounded-full bg-violet-200">
                <CircularProgressbarWithChildren
                  styles={buildStyles({
                    pathColor: "#57E98F",
                    textColor: "black",
                    strokeLinecap: "round",
                    pathTransitionDuration: 0.5,
                  })}
                  value={(props?.target?.health ?? 0 / 2) * 100}
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
                      value={(props?.target?.shield ?? 0 / 4) * 100}
                    >
                      <div className=" flex flex-col items-center justify-center font-semibold">
                        {props.target?.eliminated ? (
                          <p>❌</p>
                        ) : (
                          <>
                            {props.target?.initials ? (
                              <p>{props.target?.initials}</p>
                            ) : (
                              <div className={`aspect-square`}>
                                <Image alt="robot icon" width={20} src={bot} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            ) : (
              "OFF"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAutoAttack;
