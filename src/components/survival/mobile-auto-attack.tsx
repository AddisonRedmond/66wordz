import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { WordObject } from "~/utils/survival/surivival";

type PlayerDataWithoutId = {
  health: number;
  shield: number;
  attack: number;
  eliminated: boolean;
  initials?: string;
  word: WordObject;
};

type AutoAttackProps = {
  first?: PlayerDataWithoutId;
  last?: PlayerDataWithoutId;
  setAutoAttack: (autoAttack: "first" | "last" | "random" | "off") => void;
  autoAttack: "first" | "last" | "random" | "off";
};
const MobileAutoAttack: React.FC<AutoAttackProps> = (
  props: AutoAttackProps,
) => {
  return (
    <div className="mb-3 h-24 w-full text-center font-semibold">
      <p className="">Auto Attack</p>

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
              value={props?.first?.health ?? 0}
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
                  value={props?.first?.shield ?? 0}
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
              })}
              value={props?.last?.health ?? 0}
              strokeWidth={10}
            >
              <div className="h-full w-full">
                <CircularProgressbarWithChildren
                  styles={buildStyles({
                    pathColor: "#1E8BE1",
                    textColor: "black",
                    trailColor: "transparent",
                  })}
                  strokeWidth={10}
                  value={props?.last?.shield ?? 0}
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
          <p>Auto</p>
          <button
            onClick={() => props.setAutoAttack("off")}
            className={`flex aspect-square h-[50px] items-center justify-center rounded-full border-4 border-stone-600 text-lg font-bold text-stone-600 duration-150 ease-in-out ${props.autoAttack === "off" ? "bg-violet-200" : ""}`}
          >
            OFF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAutoAttack;
