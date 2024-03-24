import { AnimatePresence, m } from "framer-motion";
import Points from "./points";

type OpponentProps = {
  points?: number;
  wordLength: number;
  matchingIndex?: number[];
  numOfOpponents?: number;
  targetPoints: number;
};
const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  const opponentSizePercentage = 100 / Math.sqrt(props?.numOfOpponents ?? 0); // Using the square root for both width and height
  const isQualified = () => {
    const opponentPoints = props.points ?? 0;
    return opponentPoints >= props.targetPoints;
  };
  return (
    <m.div
      className="rounded-md border-2 border-zinc-400 p-2"
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        width: `${opponentSizePercentage}%`,
        maxWidth: "50%",
      }}
      exit={{ scale: 0 }}
    >
      <Points
        totalPoints={props?.points ? props.points : 0}
        pointsTarget={props.targetPoints}
      />
      <AnimatePresence>
        <div className="mt-2 flex flex-row justify-center gap-1">
          {isQualified() ? (
            <m.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              QUALIFIED
            </m.p>
          ) : (
            Array.from({ length: props.wordLength }).map((_, index: number) => {
              return (
                <m.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={index}
                  className={`flex aspect-square w-1/5 items-center justify-center text-3xl font-semibold duration-100 ease-in-out ${
                    (props?.matchingIndex ?? []).includes(index)
                      ? "bg-[#00DFA2]"
                      : "bg-stone-500"
                  }`}
                ></m.div>
              );
            })
          )}
        </div>
      </AnimatePresence>
    </m.div>
  );
};

export default Opponent;
