import { m } from "framer-motion";
import { handleColor } from "~/utils/game";
import Timer from "./timer";

type OpponentProps = {
  word: string;
  guesses: string[];
  id: string;
  timer: number;
  numOfOpponents: number;
  endGame: ()=> void
};

const Opponent: React.FC<OpponentProps> = ({
  word,
  guesses,
  timer,
  numOfOpponents,
  endGame,
}: OpponentProps) => {
  const tempTime = new Date();
  tempTime.setSeconds(tempTime.getSeconds() + 100);
  const opponentSizePercentage = 100 / Math.sqrt(numOfOpponents); // Using the square root for both width and height
  return (
    <m.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        width: `${opponentSizePercentage}%`,
        height: `${opponentSizePercentage}%`,
      }}
      exit={{ scale: 0 }}
      className={`flex flex-col gap-1 rounded-md border-2 border-gray-400 p-1 max-w-xs aspect-square`}
    >
      {!!timer && <Timer expiryTimestamp={new Date(timer)} opponent={true} endGame={endGame}/>}
      {Array.from({ length: 5 }).map((_, index: number) => {
        return (
          <div key={index} className="flex flex-row justify-center gap-1 ">
            {
              <>
                {Array.from({ length: 5 }).map((_, tileIndex: number) => {
                  return (
                    <m.div
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
                      className="aspect-square w-1/5 bg-black"
                    ></m.div>
                  );
                })}
              </>
            }
          </div>
        );
      })}
    </m.div>
  );
};

export default Opponent;
