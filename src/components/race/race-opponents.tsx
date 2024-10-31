import { RacePlayerData } from "~/utils/race";
import RaceOpponentsContainer from "./race-opponents-container";
import { m } from "framer-motion";

type RaceOpponentsProps = {
  opponents: Record<string, RacePlayerData>;
  opponentIds: string[];
};

const RaceOpponents: React.FC<RaceOpponentsProps> = (props) => {
  const opponentSizePercentage =
    90 /
    Math.sqrt(
      props.opponentIds.filter((playerId) => {
        return !props.opponents[playerId]?.eliminated;
      }).length,
    );

  return (
    <RaceOpponentsContainer>
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
            <p className="ml-2 w-fit rounded-t-md bg-zinc-700 px-2 py-1 text-xs font-semibold text-white">
              {props.opponents?.[id]?.initials ?? "N/A"}
            </p>

            <div className="flex h-full items-center justify-center gap-1 rounded-md border-2 border-zinc-300 p-1 duration-150 ease-in-out">
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
                    className={`min-w-1 my-1 grid aspect-square h-full w-1/5 place-content-center duration-150 ease-in-out ${opponentSizePercentage < 20 ? "rounded-none" : "rounded-md"}`}
                  >
                    {props.opponents[id]?.revealIndex?.includes(index) && (
                      <m.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ fontSize: `${opponentSizePercentage / 2}px` }}
                        className={`font-bold hidden lg:block`}
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
    </RaceOpponentsContainer>
  );
};

export default RaceOpponents;
