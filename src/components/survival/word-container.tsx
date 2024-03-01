import SurvivalTile from "./survival-tile";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import sword from "../../../public/Sword.svg";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import AnimateLetter from "./animated-letter";
type WordContainerProps = {
  word?: string;
  type?: "shield" | "health";
  value?: number;
  attack?: number;
  match?: string[];
  eliminated?: boolean;
};

const WordContainer: React.FC<WordContainerProps> = ({
  word,
  type,
  ...props
}: WordContainerProps) => {
  if (word) {
    const getType = () => {
      if (type === "shield") {
        return shield as string | StaticImport;
      } else if (type === "health") {
        return health as string | StaticImport;
      }
      return shield as string | StaticImport;
    };

    return (
      <motion.div
        className={`flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
        <div className="flex h-full flex-col items-center justify-center font-semibold">
          <Image height={21} src={sword} alt="status type" />
          <AnimateLetter letters={props.attack} />
        </div>
        <div className="flex h-full flex-col items-center justify-center font-semibold">
          <Image height={21} src={getType()} alt="status type" />
          <AnimateLetter letters={props.value} />
        </div>
        {word.split("").map((letter: string, index: number) => {
          return (
            <SurvivalTile
              key={index}
              letter={letter}
              revealed={props.match?.includes(letter) || props?.eliminated}
            />
          );
        })}
      </motion.div>
    );
  }
};

export default WordContainer;
