import SurvivalTile from "./survival-tile";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import sword from "../../../public/Sword.svg";
import Image from "next/image";
import { motion } from "framer-motion";
import { WordLength } from "~/utils/survival/surivival";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
type WordContainerProps = {
  word?: string;
  type?: "shield" | "health";
  value?: number;
  attack?: number;
  match?: string[];
  infoDirection: "left" | "right";
  infoHeight: "top" | "bottom";
  focus: WordLength;
  setFocus: (focus: WordLength) => void;
  id: WordLength;
  matches?: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
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
        onClick={() => props.setFocus(props.id)}
        className={`relative flex w-fit cursor-pointer flex-row items-center justify-center gap-2 rounded-md border-2 duration-150 ease-in-out ${props.focus === props.id ? "border-violet-500" : "border-zinc-200"}  bg-stone-300 px-2 py-1`}
      >
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
              revealed={props.match?.includes(letter)}
            />
          );
        })}
        {/* <div
          className={`absolute aspect-square w-8 ${props.infoDirection === "left" ? "-left-10" : "-right-10"} flex`}
        >
          <CircularProgressbar
            value={80}
            strokeWidth={50}
            styles={buildStyles({
              strokeLinecap: "butt",
              pathColor: "#4ADE80",
            })}
          />
        </div> */}
      </motion.div>
    );
  }
};

export default WordContainer;
