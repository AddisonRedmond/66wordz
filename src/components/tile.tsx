import { motion } from "framer-motion";

type TileProps = {
  letters: string;
  auto?: boolean;
  backgroundColor?: string;
};

const Tile: React.FC<TileProps> = (props: TileProps) => {
  const alphabet: string[] = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  return (
    <div className="flex gap-2 ">
      {props.letters.split("").map((letter: string, index: number) => {
        return (
          <div
            key={index}
            className={`flex aspect-square min-h-[50px] w-[7vh] min-w-[50px] flex-col items-center overflow-hidden rounded-md text-[6vh] font-semibold text-white ${
              props.backgroundColor ? props.backgroundColor : "bg-[#9462C6]"
            }`}
          >
            {alphabet.map((alphabetLetter: string, index: number) => {
              return (
                <motion.p
                  className="flex h-full items-center justify-center"
                  animate={{
                    y: `-${alphabet.indexOf(letter) * 7}vh`,
                  }}
                  transition={{ duration: 0.5 }}
                  key={`${index}letter`}
                >
                  {alphabetLetter}
                </motion.p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Tile;
