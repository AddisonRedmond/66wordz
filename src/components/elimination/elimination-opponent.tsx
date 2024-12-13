import { AnimatePresence, m } from "framer-motion";
import { EliminationPlayerData } from "~/custom-hooks/useEliminationData";
import Points from "./points";
import OpponentsContainer from "../board-components/opponents-container";

type EliminationOpponentProps = {
  opponents?: EliminationPlayerData;
  pointsGoal?: number;
  wordLength?: number;
};

const EliminationOpponent: React.FC<EliminationOpponentProps> = (props) => {
  // Using the square root for both width and height

  const opponentSizePercentage =
    90 /
    Math.sqrt(
      Object.keys(props?.opponents || []).filter((playerId) => {
        return !props.opponents![playerId]?.eliminated;
      }).length,
    );

  return (
    <OpponentsContainer>
      <AnimatePresence>
        {props.opponents &&
          Object.keys(props.opponents).map((id: string) => {
            if (!props.opponents?.[id]?.eliminated)
              return (
                <m.div
                  key={id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, ease: "linear" }}
                  style={{
                    width: `${opponentSizePercentage}%`,
                    minWidth: "85px",
                    minHeight: "20px",
                    maxWidth: "300px",
                  }}
                  className="flex max-w-96 flex-col gap-1 rounded-md bg-zinc-50 p-1 shadow-md outline outline-1 outline-zinc-200 duration-150 ease-in-out"
                >
                  <div className="flex w-full justify-between text-xs">
                    <p className="font-bold">
                      {props.opponents?.[id]?.initials ?? "N/A"}
                    </p>
                  </div>
                  <Points
                    pointsGoal={props.pointsGoal}
                    totalPoints={props.opponents?.[id]?.points}
                  />
                  <div className="flex h-fit items-center justify-center gap-1">
                    {Array.from(
                      { length: props.wordLength ?? 5 },
                      (_, index) => (
                        <div
                          key={index}
                          className={`aspect-square w-1/5 min-w-[5px] ${props.opponents?.[id]?.revealIndex?.includes(index) ? "bg-[#00DFA2]" : "bg-zinc-300"}`}
                        ></div>
                      ),
                    )}
                  </div>
                </m.div>
              );
          })}
      </AnimatePresence>
    </OpponentsContainer>
  );
};

export default EliminationOpponent;
