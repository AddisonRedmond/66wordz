import { useEffect } from "react";
import WordTile from "./word-tile";

import { AnimationScope, m, useAnimate } from "framer-motion";
type GuessContainerProps = {
  word?: string;
  wordLength?: number;
  spellCheck?: boolean;
  finishSpellCheck?: () => void;
  animationScope: AnimationScope<any>;
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
    if (props.finishSpellCheck) {
      props.finishSpellCheck();
    }
  }, [props.spellCheck]);

  return (
    <div
      ref={props.animationScope}
      className={`flex h-16 w-full flex-row rounded-md bg-stone-100 px-2 py-1 shadow-md duration-150 ease-in-out`}
    >
      <div
        ref={scope}
        className="flex h-full w-full items-center justify-center gap-1"
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
      </div>
    </div>
  );
};

export default GuessContainer;
