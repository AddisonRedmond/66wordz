import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { SurvivalPlayerObject } from "~/utils/survival/surivival";

type MobileAttackMenuProps = {
  firstPlace?: SurvivalPlayerObject;
  lastPlace?: SurvivalPlayerObject;
  random?: SurvivalPlayerObject;
};

const MobileOpponent: React.FC<{
  initials: string;
  health: number;
  shield: number;
  maxHealth: number;
  maxShield: number;
  title: string;
}> = (props) => {
  return (
    <div className="">
      <CircularProgressbarWithChildren
        value={(props.health / props.maxHealth) * 100}
        styles={buildStyles({
          pathColor: "#57E98F",
          textColor: "black",
          strokeLinecap: "round",
          trailColor: "#d3d3d3",
          pathTransitionDuration: 0.5,
        })}
        strokeWidth={11}
      >
        <div className="h-full w-full">
          <CircularProgressbarWithChildren
            value={(props.shield / props.maxShield) * 100}
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
              <p className="font-semibold text-sm">{props.title}</p>
              <p className="text-sm font-semibold">{props.initials}</p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

const MobileAttackMenu: React.FC<MobileAttackMenuProps> = (props) => {
  const initials = "ALR";
  const health = 2;
  const shield = 2;

  const MAX_HEALTH = 2;
  const MAX_SHIELD = 4;

  return (
    <div className="flex h-16 w-full items-center justify-between">
      <div className=" size-16 text-center">
        <MobileOpponent
          initials={initials}
          health={health}
          shield={shield}
          maxHealth={MAX_HEALTH}
          maxShield={MAX_SHIELD}
          title="1st"
        />
      </div>
      <div className=" h-16 w-16 text-center">
        <MobileOpponent
          initials={initials}
          health={health}
          shield={shield}
          maxHealth={MAX_HEALTH}
          maxShield={MAX_SHIELD}
          title="Last"

        />
      </div>
      <div className=" h-16 w-16 text-center">
        <MobileOpponent
          initials={initials}
          health={health}
          shield={shield}
          maxHealth={MAX_HEALTH}
          maxShield={MAX_SHIELD}
          title="Rand"
        />
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-zinc-700 text-sm font-bold">
        <p>All</p>
      </div>
    </div>
  );
};

export default MobileAttackMenu;
