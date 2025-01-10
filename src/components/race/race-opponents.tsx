import { AnimatePresence, m } from "framer-motion";
import OpponentsContainer from "../board-components/opponents-container";
import { DefaultPlayerData } from "~/utils/game";

type RaceOpponentsProps = {
  opponents: Record<string, DefaultPlayerData>;
  opponentIds?: string[];
};

const RaceOpponents: React.FC<RaceOpponentsProps> = (props) => {
  const opponentSizePercentage =
    90 /
    Math.sqrt(
      (props.opponentIds ?? []).filter((playerId) => {
        return !props.opponents[playerId]?.eliminated;
      }).length,
    );

  return (
    <OpponentsContainer>
      <AnimatePresence>
        {props.opponentIds?.map((id) => {
          return (
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "linear" }}
              style={{
                width: `${opponentSizePercentage}%`,
              }}
              key={id}
            >
              <div className="flex max-w-96 flex-col gap-1 rounded-md p-1 shadow-md outline outline-1 outline-zinc-200 duration-150 ease-in-out">
                <div className="flex justify-between text-sm">
                  <p className="font-bold">
                    {props.opponents?.[id]?.initials ?? "N/A"}
                  </p>
                  <div className="grid size-5 place-items-center rounded-full bg-zinc-500 text-white">
                    <p>{props.opponents?.[id]?.correctGuessCount}</p>
                  </div>
                </div>
                <div className="flex gap-1 duration-150 ease-in-out">
                  {props.opponents[id]?.word.split("").map((letter, index) => {
                    return (
                      <div
                        key={`${id}-${index}`}
                        style={{
                          backgroundColor: props.opponents[
                            id
                          ]?.revealIndex?.includes(index)
                            ? "#00DFA2"
                            : "#d4d4d8",
                        }}
                        className={`my-1 grid aspect-square h-full w-1/5 min-w-1 place-content-center duration-150 ease-in-out ${opponentSizePercentage < 20 ? "rounded-none" : "rounded-md"}`}
                      >
                        {props.opponents[id]?.revealIndex?.includes(index) && (
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
              </div>
            </m.div>
          );
        })}
      </AnimatePresence>
    </OpponentsContainer>
  );
};

export default RaceOpponents;
