import { m, AnimatePresence } from "framer-motion";

type WordContainerProps = {
  guess: string;
  isSpellCheck: boolean,
  setIsSpellCheck: (value: boolean) => void;
};

const GuessContainer: React.FC<WordContainerProps> = (
  props: WordContainerProps,
) => {
  return (
    <div className="flex h-[7vh] w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 p-2 duration-150 ease-in-out">
      <AnimatePresence>
        {props.guess
          .toUpperCase()
          .split("")
          .map((letter: string, index: number) => {
            return (
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1, ease: "linear"}}
                key={index}
                className={`grid aspect-square h-[5vh] place-content-center rounded-md bg-white text-[4vh] font-bold`}
              >
                <p>{letter}</p>
              </m.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default GuessContainer;
