import Image from "next/image";
import Delete from "../../public/Delete.svg";
type KeyboardProps = {
  disabled: boolean;
};

const KeyboardRow = ({
  letters,
  specialKey,
}: {
  letters: string;
  specialKey?: JSX.Element;
}) => {
  return (
    <div className="flex gap-1">
      {letters.split("").map((letter: string, index: number) => {
        return (
          <p
            className=" flex aspect-square w-7 cursor-pointer items-center justify-center rounded-md bg-neutral-200 font-bold"
            key={letter}
          >
            {letter}
          </p>
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
        <KeyboardRow letters={topRow} />
      </div>
      <div className="flex">
        <KeyboardRow
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
