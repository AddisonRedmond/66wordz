import { motion } from "framer-motion";
import Points from "./points";

type OpponentProps = {
  points?: number;
  wordLength: number;
  matchingIndex?: number[];
  numOfOpponents?: number;
};
const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  const opponentSizePercentage = 100 / Math.sqrt(props?.numOfOpponents ?? 0); // Using the square root for both width and height

  return (
    <motion.div
      className="rounded-md border-2 border-zinc-600 p-2"
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
        pointsTarget={500}
      />
      <div className="mt-2 flex flex-row justify-center gap-1">
        {Array.from({ length: props.wordLength }).map((_, index: number) => {
          return (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              key={index}
              className={`flex aspect-square w-1/5 items-center justify-center text-3xl font-semibold duration-100 ease-in-out ${
                (props?.matchingIndex ?? []).includes(index)
                  ? "bg-[#00DFA2]"
                  : "bg-stone-500"
              }`}
            >
              {
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-white"
                >
                  {props.points && props.points >= 500
                    ? "QUALD".split("")[index]
                    : ""}
                </motion.p>
              }
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Opponent;
