import { RacePlayerData } from "~/utils/race";
import RaceOpponentsContainer from "./race-opponents-container";
import { AnimatePresence, m } from "framer-motion";

type RaceOpponentsProps = {
  opponents: Record<string, RacePlayerData>;
  opponentIds?: string[];
};

const RaceOpponents: React.FC<RaceOpponentsProps> = (props) => {
  if (!props.opponentIds?.length) {
    return <p>Waiting for other players</p>;
  }

  const opponentSizePercentage =
    90 /
    Math.sqrt(
      props.opponentIds.filter((playerId) => {
        return !props.opponents[playerId]?.eliminated;
      }).length,
    );

  return (
    <RaceOpponentsContainer>
      <AnimatePresence>
        {props.opponentIds.map((id) => {
          // Destructuring as an array
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
              {/* <p className="ml-2 w-fit rounded-t-md bg-zinc-700 px-2 py-1 text-xs font-semibold text-white">
                {props.opponents?.[id]?.initials ?? "N/A"}
              </p> */}

              <div className="rounded-md border-2 border-zinc-300 p-1 duration-150 ease-in-out">
                <div className="flex justify-between text-sm">
                  <p className="font-bold">
                    {props.opponents?.[id]?.initials ?? "N/A"}
                  </p>
                  <div className="grid size-5 place-items-center rounded-full bg-zinc-500 text-white">
                    <p>{props.opponents?.[id]?.correctGuesses}</p>
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
    </RaceOpponentsContainer>
  );
};

export default RaceOpponents;
