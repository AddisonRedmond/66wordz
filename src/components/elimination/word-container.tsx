import { m, AnimatePresence } from "framer-motion";

type WordContainerProps = {
  word?: string;
  revealIndex?: number[];
};

const WordContainer: React.FC<WordContainerProps> = (
  props: WordContainerProps,
) => {
  return (
    <div className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 p-2 duration-150 ease-in-out">
      {props.word
        ?.toUpperCase()
        .split("")
        .map((letter: string, index: number) => {
          return (
            <div
              key={index}
              className={`grid aspect-square h-[5vh] place-content-center rounded-md duration-200 ease-in-out ${props?.revealIndex?.includes(index) ? "bg-emerald-400" : "bg-white"} text-[4vh] font-bold`}
            >
              <AnimatePresence>
                {props?.revealIndex?.includes(index) && (
                  <m.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {letter}
                  </m.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
};

export default WordContainer;
