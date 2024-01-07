import { AnimatePresence, motion, useAnimate } from "framer-motion";
import Tile from "./tile";
import Image from "next/image";
import Sword from "../../../public/Sword.svg";
import { Dispatch, SetStateAction, useEffect } from "react";

type GuessContainerProps = {
  guess: string;
  playerData?: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
  };
  spellCheck: boolean;
  setSpellCheck: Dispatch<SetStateAction<boolean>>;
  setIsAttack: Dispatch<SetStateAction<boolean>>;
  isAttack: boolean;
};

const GuessContainer: React.FC<GuessContainerProps> = (
  props: GuessContainerProps,
) => {
  const [scope, animate] = useAnimate();

  const control = {
    x: [-10, 10, -10, 10, 0],
    backgroundColor: ["#D6D3D1", "#FF8080", "#D6D3D1"],
  };
  useEffect(() => {
    animate(scope.current, control, { duration: 0.3 });
    props.setSpellCheck(false);
  }, [props.spellCheck]);

  return (
    <div className="relative">
      <div
        ref={scope}
        className="flex h-[7vh] w-[34vh] flex-row items-center justify-center gap-1 rounded-md border-2 bg-stone-300 p-1"
      >
        <AnimatePresence>
          {props.guess.split("").map((letter: string, index: number) => {
            return <Tile letter={letter} key={index} />;
          })}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ scale: 1, translateY: "-50%" }}
        animate={{ scale: props.isAttack ? 1.2 : 1, backgroundColor: props.isAttack ? "rgb(248 113 113)": "rgb(255 255 255)" }}
        transition={props.isAttack ? { duration: 0.5, repeat: Infinity, repeatType: "reverse" }: {}}
        onClick={() => props.setIsAttack(!props.isAttack)}
        className={`absolute -right-14 top-1/2 flex aspect-square w-12 transform cursor-pointer flex-col items-center justify-center rounded-full border-4 border-zinc-700  ${
          props.playerData?.attack === 0 ? "opacity-25" : "opacity-100"
        }`}
      >
        <div className={`absolute -top-6`}>
          <p className="font-semibold">{props.playerData?.attack}</p>
        </div>
        <Image src={Sword} alt="attack Icon" />
      </motion.button>
    </div>
  );
};

export default GuessContainer;
