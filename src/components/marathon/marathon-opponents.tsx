import { MarathonPlayerData } from "~/utils/marathon";
import OpponentsContainer from "../board-components/opponents-container";
import { AnimatePresence, m } from "framer-motion";
import OpponentHeader from "../board-components/opponent-header";
import OpponentWord from "../board-components/opponent-word";
import LifeTimer from "./life-timer";

type MarathonOpponentsProps = {
  opponents?: Record<string, MarathonPlayerData>;
  lifeTimers: Record<string, number>;
};

const MarathonOpponents: React.FC<MarathonOpponentsProps> = ({
  opponents,
  lifeTimers,
}) => {
  if (!opponents) {
    return;
  }
  const opponentSizePercentage =
    90 /
    Math.sqrt(
      Object.values(opponents).filter((data) => {
        return !data.eliminated;
      }).length,
    );

  return (
    <OpponentsContainer>
      <AnimatePresence>
        {Object.entries(opponents).map(([id, data]) => {
          return (
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "linear" }}
              style={{
                width: `${opponentSizePercentage}%`,
              }}
              key={id}
              className="flex max-w-96 flex-col gap-1 rounded-md p-1 shadow-md outline outline-1 outline-zinc-200 duration-150 ease-in-out"
            >
              <OpponentHeader
                initials={data.initials}
                correctGuessCount={data.correctGuessCount}
              />
              {lifeTimers?.[id] && (
                <LifeTimer small={true} endTime={lifeTimers[id]} />
              )}
              <OpponentWord
                revealIndex={data.revealIndex}
                uniqueKey={id}
                word={data.word}
              />
            </m.div>
          );
        })}
      </AnimatePresence>
    </OpponentsContainer>
  );
};

export default MarathonOpponents;
