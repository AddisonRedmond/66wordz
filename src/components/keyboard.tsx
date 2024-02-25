import Image from "next/image";
import Delete from "../../public/Delete.svg";
import { motion } from "framer-motion";
type KeyboardProps = {
  disabled: boolean;
  matches?: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
  handleKeyBoardLogic: (letter: string) => void;
};

const KeyboardRow = ({
  letters,
  specialKey,
  matches,
  disabled,
  handleKeyBoardLogic,
}: {
  letters: string;
  specialKey?: JSX.Element;
  matches?: { fullMatch: string[]; partialMatch: string[]; noMatch: string[] };
  disabled: boolean;
  handleKeyBoardLogic: (letter: string) => void;
}) => {
  const handleColors = (letter: string) => {
    if (!matches) return;
    if (matches.fullMatch.includes(letter)) {
      return "#00DFA2";
    } else if (matches.partialMatch.includes(letter)) {
      return "#F6FA70";
    } else if (matches.noMatch.includes(letter)) {
      return "#545B77";
    }
  };
  return (
    <>
      {letters.split("").map((letter: string) => {
        return (
          <motion.p
            onClick={() => handleKeyBoardLogic(letter)}
            animate={{ backgroundColor: handleColors(letter) }}
            className={`flex aspect-square w-[10%] max-w-12 min-w-8 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } items-center justify-center rounded-md border-2 border-neutral-500 bg-neutral-200 font-bold sm:border-none`}
            key={letter}
          >
            {letter}
          </motion.p>
        );
      })}
      {specialKey}
    </>
  );
};

const Keyboard: React.FC<KeyboardProps> = (props: KeyboardProps) => {
  const topRow = "QWERTYUIOP";
  const middleRow = "ASDFGHJKL";
  const bottomRow = "ZXCVBNM";
  return (
    <div className="flex w-11/12 flex-col items-center gap-1">
      <div className="flex w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={topRow}
          disabled={props.disabled}
        />
      </div>
      <div className="flex w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={middleRow}
          disabled={props.disabled}
          specialKey={
            <span
              onClick={() => props.handleKeyBoardLogic("Backspace")}
              className={`hidden aspect-square w-8 items-center justify-center rounded-md bg-neutral-200 font-bold sm:visible sm:flex sm:w-10`}
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
      <div className="flex w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={bottomRow}
          disabled={props.disabled}
          specialKey={
            <button
              onClick={() => props.handleKeyBoardLogic("Enter")}
              className={`${
                props.disabled ? "cursor-not-allowed" : "cursor-pointer"
              }  hidden cursor-pointer items-center justify-center rounded-md bg-neutral-200 px-1 font-bold sm:visible sm:flex`}
            >
              ENTER
            </button>
          }
        />
      </div>
      <div className="sm:invisibile visible flex w-full justify-around text-center text-lg font-semibold">
        <button
          onClick={() => props.handleKeyBoardLogic("Enter")}
          className="h-10 w-1/4 rounded-md  border-2 border-neutral-700 text-center sm:hidden"
        >
          Enter
        </button>
        <button
          onClick={() => props.handleKeyBoardLogic("Backspace")}
          className="h-10 w-1/4 rounded-md  border-2 border-neutral-700 text-center sm:hidden"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
