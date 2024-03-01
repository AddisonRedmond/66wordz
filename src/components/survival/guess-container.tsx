import { AnimatePresence, useAnimate } from "framer-motion";
import SurvialTile from "./survival-tile";
import { Dispatch, SetStateAction, useEffect } from "react";

type GuessContainerProps = {
  guess: string;
  playerData?: {
    health: number;
    shield: number;
    eliminated: boolean;
  };
  spellCheck: boolean;
  setSpellCheck: Dispatch<SetStateAction<boolean>>;
  incorrectGuess: boolean;
  setIsIncorrectGuess: Dispatch<SetStateAction<boolean>>;
};

const GuessContainer: React.FC<GuessContainerProps> = (
  props: GuessContainerProps,
) => {
  const [scope, animate] = useAnimate();

  const control = {
    x: [-10, 10, -10, 10, 0],
    // backgroundColor: ["#D6D3D1", "#FF8080", "#D6D3D1"],
  };

  const incorrectGuess = {
    backgroundColor: ["#D6D3D1", "#FF8080", "#D6D3D1"],
  };

  useEffect(() => {
    animate(scope.current, control, { duration: 0.3 });
    props.setSpellCheck(false);
  }, [props.spellCheck]);

  useEffect(() => {
    animate(scope.current, incorrectGuess, { duration: 0.3 });
    props.setIsIncorrectGuess(false);
  }, [props.incorrectGuess]);


  return (
    <div className="relative">
      <div
        ref={scope}
        className="flex h-[7vh] w-[34vh] min-w-64 min-h-14 flex-row items-center justify-center gap-1 rounded-md border-2 bg-stone-300 p-1"
      >
        <AnimatePresence>
          {props.guess.split("").map((letter: string, index: number) => {
            return <SurvialTile letter={letter} key={index} revealed={true} />;
          })}
        </AnimatePresence>
      </div>


    </div>
  );
};

export default GuessContainer;
