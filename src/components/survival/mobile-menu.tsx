import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import {
  SurvivalPlayerData,
  findPlayerToAttack,
} from "~/utils/survival/surivival";
import { useState } from "react";
import MobileOpponents from "./mobile-opponents";
import { AnimatePresence } from "framer-motion";
import InfoIcon from "~/../public/info.svg";

import Image from "next/image";

type MobileMenuProps = {
  setAttackPosition: (id: string) => void;
  attackPosition: string;
  allPlayers: SurvivalPlayerData;
  userId: string;
  handleSetRandom: () => void;
};
const MobileOpponent: React.FC<{
  initials?: string;
  health: number;
  shield: number;
  maxHealth: number;
  maxShield: number;
  title: string;
  highlighted: boolean;
}> = (props) => {
  return (
    <div className="h-full w-full">
      <CircularProgressbarWithChildren
        value={(props.health / props.maxHealth) * 100}
        styles={buildStyles({
          pathColor: "#57E98F",
          textColor: "black",
          strokeLinecap: "round",
          trailColor: "#d3d3d3",
          pathTransitionDuration: 0.5,
          backgroundColor: "#d1d5db",
        })}
        background={props.highlighted}
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
              <p className="text-sm font-semibold">{props.title}</p>
              <p className="text-xs font-medium">{props?.initials ?? "N/A"}</p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = (props) => {
  const [isRandom, setIsRandom] = useState(false);
  const [mobileOpponentsIsOpen, setMobileOpponentsIsOpen] = useState(false);
  const firstPlayer = findPlayerToAttack(
    props.userId,
    props.allPlayers,
    "First",
  );
  const lastPlayer = findPlayerToAttack(props.userId, props.allPlayers, "Last");

  const MAX_SHIELD = 4;
  const MAX_HEALTH = 2;

  const isSpecificTarget = () => {
    if (
      props.attackPosition === "First" ||
      props.attackPosition === "Last" ||
      isRandom
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      <AnimatePresence>
        {mobileOpponentsIsOpen && (
          <MobileOpponents
            setMobileOpponentIsOpen={setMobileOpponentsIsOpen}
            allPlayers={props.allPlayers}
            attackPosition={props.attackPosition}
            setAttackPosition={props.setAttackPosition}
          />
        )}
      </AnimatePresence>

      <div className="flex h-16 w-full items-center justify-between">
        <div
          onClick={() => {
            props.setAttackPosition("First"), setIsRandom(false);
          }}
          className=" size-16 text-center"
        >
          {firstPlayer && (
            <MobileOpponent
              initials={props.allPlayers[firstPlayer]?.initials ?? "BOT"}
              health={props.allPlayers[firstPlayer]!.health}
              shield={props.allPlayers[firstPlayer]!.shield}
              maxHealth={2}
              maxShield={4}
              title="1st"
              highlighted={props.attackPosition === "First"}
            />
          )}
        </div>
        <div
          onClick={() => {
            props.setAttackPosition("Last"), setIsRandom(false);
          }}
          className=" h-16 w-16 text-center"
        >
          {lastPlayer && (
            <MobileOpponent
              initials={props.allPlayers[lastPlayer]?.initials ?? "BOT"}
              health={props.allPlayers[lastPlayer]!.health}
              shield={props.allPlayers[lastPlayer]!.shield}
              maxHealth={2}
              maxShield={4}
              title="Last"
              highlighted={props.attackPosition === "Last"}
            />
          )}
        </div>
        <div
          onClick={() => {
            props.handleSetRandom(), setIsRandom(true);
          }}
          className=" h-16 w-16 text-center"
        >
          {isRandom ? (
            <MobileOpponent
              initials={
                props.allPlayers[props.attackPosition]?.initials ?? "N/A"
              }
              health={props.allPlayers[props.attackPosition]!.health}
              shield={props.allPlayers[props.attackPosition]!.shield}
              maxHealth={MAX_HEALTH}
              maxShield={MAX_SHIELD}
              title="Rand"
              highlighted={isRandom}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-zinc-700 text-sm font-bold">
              <p>Rand</p>
            </div>
          )}
        </div>

        <div
          onClick={() => {
            setMobileOpponentsIsOpen(true), setIsRandom(false);
          }}
          className={`flex h-16 w-16 items-center ${!isSpecificTarget() && "justify-center rounded-full border-8 border-zinc-700 text-sm font-bold"}`}
        >
          {isSpecificTarget() ? (
            <MobileOpponent
              health={props.allPlayers[props.attackPosition]!.health}
              shield={props.allPlayers[props.attackPosition]!.shield}
              initials={props.allPlayers[props.attackPosition]?.initials}
              maxHealth={MAX_HEALTH}
              maxShield={MAX_SHIELD}
              title=""
              highlighted={true}
            />
          ) : (
            <Image src={InfoIcon} alt="show all players" height={20} />
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
