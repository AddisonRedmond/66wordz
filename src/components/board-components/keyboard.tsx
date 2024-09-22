import Image from "next/image";
import Delete from "../../../public/Delete.svg";
import { m } from "framer-motion";
type KeyboardProps = {
  disabled: boolean;
  matches?: { full: string[]; partial: string[]; none: string[] } | null;
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
  matches?: { full: string[]; partial: string[]; none: string[] } | null;
  disabled: boolean;
  handleKeyBoardLogic: (letter: string) => void;
}) => {
  const handleColors = (letter: string) => {
    if (!matches) return "#e5e5e5";
    if (matches?.full && matches.full.includes(letter)) {
      return "#00DFA2";
    } else if (matches?.partial && matches.partial.includes(letter)) {
      return "#F6FA70";
    } else if (matches?.none && matches.none.includes(letter)) {
      return "#545B77";
    }

    return "#e5e5e5";
  };
  return (
    <>
      {letters.split("").map((letter: string) => {
        return (
          <m.button
            onClick={() => handleKeyBoardLogic(letter)}
            animate={{
              backgroundColor: handleColors(letter),
              color: handleColors(letter) === "#545B77" ? "#FFFFFF" : "#000000",
            }}
            style={{ width: "10%" }}
            className={` flex h-full max-w-12 sm:aspect-square sm:h-auto ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } items-center justify-center rounded-md font-bold sm:border-none`}
            key={letter}
          >
            {letter}
          </m.button>
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
    <div className="flex h-56 max-w-full flex-col items-center gap-1 md:h-fit">
      <div className="flex h-1/3 w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={topRow}
          disabled={props.disabled}
        />
      </div>
      <div className="flex h-1/3 w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={middleRow}
          disabled={props.disabled}
          specialKey={
            <button
              onClick={() => props.handleKeyBoardLogic("Backspace")}
              className={`hidden aspect-square items-center  justify-center rounded-md bg-neutral-200 font-bold sm:visible sm:flex sm:w-10`}
            >
              <Image
                className={`${
                  props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                } `}
                src={Delete}
                alt="Delete svg"
              />
            </button>
          }
        />
      </div>
      <div className="flex h-1/3 w-full justify-center gap-1">
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
      <div className="sm:invisibile visible mt-3 flex w-full justify-around text-center text-lg font-semibold">
        <button
          onClick={() => props.handleKeyBoardLogic("Enter")}
          className="h-12 w-1/3 rounded-md  border-2 border-neutral-700 text-center sm:hidden"
        >
          Enter
        </button>
        <button
          onClick={() => props.handleKeyBoardLogic("Backspace")}
          className="h-12 w-1/3 rounded-md  border-2 border-neutral-700 text-center sm:hidden"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
