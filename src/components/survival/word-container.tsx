import Tile from "./tile";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import sword from "../../../public/Sword.svg";
import Image from "next/image";

type WordContainerProps = {
  word?: string;
  revealedIndex?: number[];
  type?: "shield" | "health";
  value?: number;
  attack?: number;
};

const WordContainer: React.FC<WordContainerProps> = ({
  word,
  revealedIndex,
  type,
  ...props
}: WordContainerProps) => {

  console.log(revealedIndex?.includes(7))
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
      <div className="relative flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-stone-300 px-2 py-1">
        <div className="flex flex-col items-center justify-center font-semibold">
          <Image src={getType()} alt="status type" />
          <p className="text-sm">{props.value}</p>
        </div>
        {word.split("").map((letter: string, index: number) => {
          return (
            <Tile
              key={index}
              letter={letter}
              revealed={revealedIndex?.includes(index)}
            />
          );
        })}
        <div className="flex flex-col items-center justify-center font-semibold">
          <Image src={sword} alt="status type" />
          <p className="text-sm">{props.attack}</p>
        </div>
      </div>
    );
  }
};

export default WordContainer;
