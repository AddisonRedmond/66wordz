import Image from "next/image";
import Delete from "../../public/Delete.svg";
import { motion } from "framer-motion";
type KeyboardProps = {
  disabled: boolean;
  matches: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
};

const KeyboardRow = ({
  letters,
  specialKey,
  matches,
}: {
  letters: string;
  specialKey?: JSX.Element;
  matches: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
}) => {
  const handleColors = (letter: string) => {
    if (matches.fullMatch.includes(letter)) {
      return "#00DFA2";
    } else if (matches.partialMatch.includes(letter)) {
      return "#F6FA70";
    } else if (matches.noMatch.includes(letter)) {
      return "#545B77";
    }
  };
  return (
    <div className="flex gap-1">
      {letters.split("").map((letter: string, index: number) => {
        return (
          <motion.p
            // initial={{ backgroundColor: "#F5F5F4" }}
            animate={{ backgroundColor: handleColors(letter) }}
            className=" flex aspect-square w-7 cursor-pointer items-center justify-center rounded-md bg-neutral-200 font-bold"
            key={letter}
          >
            {letter}
          </motion.p>
        );
      })}
      {specialKey}
    </div>
  );
};

const Keyboard: React.FC<KeyboardProps> = (props: KeyboardProps) => {
  const topRow = "QWERTYUIOP";
  const middleRow = "ASDFGHJKL";
  const bottomRow = "ZXCVBNM";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex">
        <KeyboardRow matches={props.matches} letters={topRow} />
      </div>
      <div className="flex">
        <KeyboardRow
          matches={props.matches}
          letters={middleRow}
          specialKey={
            <span className="flex aspect-square w-7 cursor-pointer items-center justify-center rounded-md bg-neutral-200 font-bold">
              <Image className="" src={Delete} alt="Delete svg" />
            </span>
          }
        />
      </div>
      <div className="flex">
        <KeyboardRow
          matches={props.matches}
          letters={bottomRow}
          specialKey={
            <p className="flex cursor-pointer items-center justify-center rounded-md bg-neutral-200 px-1 font-bold">
              ENTER
            </p>
          }
        />
      </div>
    </div>
  );
};

export default Keyboard;
