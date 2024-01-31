import SurvivalTile from "./survival-tile";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import sword from "../../../public/Sword.svg";
import Image from "next/image";
import { motion } from "framer-motion";

type WordContainerProps = {
  word?: string;
  type?: "shield" | "health";
  value?: number;
  attack?: number;
  match?: number[];
};

const WordContainer: React.FC<WordContainerProps> = ({
  word,
  type,
  ...props
}: WordContainerProps) => {
  console.log(props.match);
  if (word) {
    const getType = () => {
      if (type === "shield") {
        return shield;
      } else if (type === "health") {
        return health;
      }
      return shield;
    };

    return (
      <motion.div className="relative flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 px-2 py-1">
        <div className="flex flex-col items-center justify-center font-semibold">
          <Image height={20} src={sword} alt="status type" />
          <p className="text-sm">{props.attack}</p>
        </div>
        <div className="flex flex-col items-center justify-center font-semibold">
          <Image height={20} src={getType()} alt="status type" />
          <p className="text-sm">{props.value}</p>
        </div>
        {word.split("").map((letter: string, index: number) => {
          return (
            <SurvivalTile
              key={index}
              letter={letter}
              revealed={props.match?.includes(index)}
            />
          );
        })}
      </motion.div>
    );
  }
};

export default WordContainer;
