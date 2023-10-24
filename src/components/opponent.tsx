import { motion } from "framer-motion";
import { handleColor } from "~/utils/game";
import Timer from "./timer";

type OpponentProps = {
  word: string;
  guesses: string[];
  id: string;
};

const Opponent: React.FC<OpponentProps> = ({
  word,
  guesses,
  id,
}: OpponentProps) => {
  const tempTime = new Date();
  tempTime.setSeconds(tempTime.getSeconds() + 100);
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="flex flex-col gap-1 rounded-md border-2 border-gray-400 p-1"
    >
      <Timer expiryTimestamp={tempTime} />
      {Array.from({ length: 5 }).map((_, index: number) => {
        return (
          <div key={index} className="flex flex-row gap-1">
            {
              <>
                {Array.from({ length: 5 }).map((_, tileIndex: number) => {
                  return (
                    <motion.div
                      initial={{ backgroundColor: "#F5F5F4" }}
                      animate={
                        guesses
                          ? {
                              backgroundColor: handleColor(
                                guesses[index]?.split("")[tileIndex],
                                word,
                                tileIndex,
                              ),
                            }
                          : { backgroundColor: "#F5F5F4" }
                      }
                      key={`${tileIndex}${index}`}
                      className="aspect-square w-2 bg-black"
                    ></motion.div>
                  );
                })}
              </>
            }
          </div>
        );
      })}
    </motion.div>
  );
};

export default Opponent;
