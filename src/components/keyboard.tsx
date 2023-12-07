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
  disabled,
}: {
  letters: string;
  specialKey?: JSX.Element;
  matches: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
  disabled: boolean;
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
      {letters.split("").map((letter: string) => {
        return (
          <motion.p
            // initial={{ backgroundColor: "#F5F5F4" }}
            animate={{ backgroundColor: handleColors(letter) }}
            className={`flex aspect-square w-8 sm:w-10 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } items-center justify-center rounded-md border-2 border-black bg-neutral-200 font-bold sm:border-none`}
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
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex">
        <KeyboardRow
          matches={props.matches}
          letters={topRow}
          disabled={props.disabled}
        />
      </div>
      <div className="flex">
        <KeyboardRow
          matches={props.matches}
          letters={middleRow}
          disabled={props.disabled}
          specialKey={
            <span
              className={`hidden aspect-square w-7 items-center justify-center rounded-md bg-neutral-200 font-bold sm:visible sm:flex`}
            >
              <Image
                className={`${
                  props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                } `}
                src={Delete}
                alt="Delete svg"
              />
            </span>
          }
        />
      </div>
      <div className="flex">
        <KeyboardRow
          matches={props.matches}
          letters={bottomRow}
          disabled={props.disabled}
          specialKey={
            <p
              className={`${
                props.disabled ? "cursor-not-allowed" : "cursor-pointer"
              }  hidden cursor-pointer items-center justify-center rounded-md bg-neutral-200 px-1 font-bold sm:visible sm:flex`}
            >
              ENTER
            </p>
          }
        />
      </div>
      <div className="sm:invisibile visible flex w-full justify-around text-center text-lg font-semibold">
        <p className="my-auto flex h-10 w-1/4 flex-col justify-center rounded-md border-2 border-neutral-700 sm:hidden">
          Enter
        </p>
        <p className="my-auto flex h-10 w-1/4 flex-col justify-center rounded-md border-2 border-neutral-700 sm:hidden">
          Delete
        </p>
      </div>
    </div>
  );
};

export default Keyboard;
