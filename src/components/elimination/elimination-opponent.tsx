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
    95 /
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
                    totalPoints={props.opponents?.[id]?.correctGuessCount}
                  />
                  <div className="flex h-fit items-center justify-center gap-1">
                    {props.opponents?.[id]?.word
                      .split("")
                      .map((letter, index) => {
                        return (
                          <div
                            key={`${id}-${index}`}
                            style={{
                              backgroundColor: props.opponents![
                                id
                              ]?.revealIndex?.includes(index)
                                ? "#00DFA2"
                                : "#d4d4d8",
                            }}
                            className={`my-1 grid aspect-square h-full w-1/5 min-w-1 place-content-center duration-150 ease-in-out ${opponentSizePercentage < 20 ? "rounded-none" : "rounded-md"}`}
                          >
                            {props.opponents?.[id]?.revealIndex?.includes(
                              index,
                            ) && (
                              <m.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                  fontSize: `${opponentSizePercentage / 2}px`,
                                }}
                                className={`hidden font-bold lg:block`}
                              >
                                {letter}
                              </m.p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </m.div>
              );
          })}
      </AnimatePresence>
    </OpponentsContainer>
  );
};

export default EliminationOpponent;
