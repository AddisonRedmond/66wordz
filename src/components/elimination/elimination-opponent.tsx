import { AnimatePresence, m } from "framer-motion";
import { EliminationPlayerData } from "~/custom-hooks/useEliminationData";

type EliminationOpponentProps = {
  opponents?: EliminationPlayerData;
};

const EliminationOpponent: React.FC<EliminationOpponentProps> = (props) => {
  // Using the square root for both width and height
  if (props?.opponents) {
    const opponentSizePercentage =
      90 / Math.sqrt(Object.keys(props.opponents).length);
    return (
      <div className="flex flex-grow flex-wrap items-center justify-center px-2">
        {Object.keys(props.opponents).map((id: string) => {
          return (
            <AnimatePresence>
              <m.div
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
                className=" h-fit items-center"
              >
                <p
                  style={{
                    marginLeft: "5px",
                    borderTop: "2px solid black",
                    borderLeft: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "0px",
                  }}
                  className="w-fit rounded-t-md bg-black px-1 text-xs font-semibold text-white"
                >
                  {props.opponents?.[id]?.initials ?? "N/A"}
                </p>
                <div
                  className={`flex h-full w-full flex-col gap-2 rounded-md border-2 border-zinc-500 p-2`}
                >
                  {props.opponents?.[id]?.eliminated ? (
                    <m.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-center"
                    >
                      ❌
                    </m.p>
                  ) : (
                    <>
                      <div>points</div>
                      <div className="flex h-fit items-center justify-center gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <div
                            key={index}
                            className={`aspect-square w-1/5 min-w-[5px] ${props.opponents?.[id]?.revealIndex?.includes(index) ? "bg-emerald-500" : "bg-zinc-300"}`}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </m.div>
            </AnimatePresence>
          );
        })}
      </div>
    );
  }
};

export default EliminationOpponent;
