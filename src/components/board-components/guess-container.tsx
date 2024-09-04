import { useEffect } from "react";
import WordTile from "./word-tile";

import { m, useAnimate } from "framer-motion";
type GuessContainerProps = {
  word?: string;
  wordLength?: number;
  spellCheck?: boolean;
};

const GuessContainer: React.FC<GuessContainerProps> = ({
  word,
  wordLength,
  ...props
}) => {
  const [scope, animate] = useAnimate();

  const control = {
    x: [-10, 10, -10, 10, 0],
  };
  useEffect(() => {
    animate(scope.current, control, { duration: 0.3 });
  }, [props.spellCheck]);

  return (
    <m.div
      ref={scope}
      className={`flex h-16 w-full flex-row items-center justify-center gap-1 rounded-md border-2 border-zinc-200 bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
    >
      {word?.split("").map((letter: string, index: number) => {
        return (
          <WordTile
            key={index}
            letter={letter}
            revealed={true}
            revealedColor="#FFFFFF"
            wordLength={wordLength ?? 5}
          />
        );
      })}
    </m.div>
  );
};

export default GuessContainer;
