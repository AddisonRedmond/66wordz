import { MarathonPlayerData } from "~/utils/marathon";
import OpponentsContainer from "../board-components/opponents-container";
import { AnimatePresence, m } from "framer-motion";
import OpponentHeader from "../board-components/opponent-header";
import OpponentWord from "../board-components/opponent-word";
import LifeTimer from "./life-timer";

type MarathonOpponentsProps = {
  opponents: Record<string, MarathonPlayerData>;
};

const MarathonOpponents: React.FC<MarathonOpponentsProps> = ({ opponents }) => {
  const opponentSizePercentage =
    90 /
    Math.sqrt(
      Object.entries(opponents).filter(([id, data]) => {
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
              className="flex flex-col gap-1 max-w-96  rounded-md border-2 border-zinc-300 p-2 duration-150 ease-in-out"
            >
              <OpponentHeader
                initials={data.initials}
                correctGuessCount={data.correctGuessCount}
              />
              {data.lifeTimer && <LifeTimer endTime={data.lifeTimer} />}
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
