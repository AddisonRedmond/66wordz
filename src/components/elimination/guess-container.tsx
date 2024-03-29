import { m, AnimatePresence, useAnimate } from "framer-motion";
import { useEffect } from "react";

type WordContainerProps = {
  guess: string;
  isSpellCheck: boolean;
  setIsSpellCheck: (value: boolean) => void;
  isIncorrectGuess: boolean;
  setIsIncorrectGuess: (value: boolean) => void;
};

const GuessContainer: React.FC<WordContainerProps> = (
  props: WordContainerProps,
) => {
  const [scope, animate] = useAnimate();

  const control = {
    x: [-10, 10, -10, 10, 0],
  };

  const incorrectGuess = {
    backgroundColor: ["#D6D3D1", "#FF8080", "#D6D3D1"],
  };

  useEffect(() => {
    animate(scope.current, control, { duration: 0.3 });
    props.setIsSpellCheck(false);
  }, [props.isSpellCheck]);

  useEffect(() => {
    animate(scope.current, props.isIncorrectGuess, { duration: 0.3 });
    props.setIsIncorrectGuess(false);
  }, [props.isIncorrectGuess]);
  return (
    <div ref={scope} className="flex h-[7vh] w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 p-2">
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
                transition={{ duration: 0.1, ease: "linear" }}
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
