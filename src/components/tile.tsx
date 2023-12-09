import { motion } from "framer-motion";

type TileProps = {
  letters: string;
  backgroundColor?: string;
  desktopOnly?: boolean;
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
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex gap-2 ${props.desktopOnly ? "hidden sm:flex" : ""}`}
    >
      {props.letters.split("").map((letter: string, index: number) => {
        return (
          <div
            key={index}
            className={`flex aspect-square w-[7vh] flex-col items-center overflow-hidden rounded-md text-[6vh] font-semibold text-white ${
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
                  transition={{
                    duration: 0.8,
                    delay: 0.25,
                    type: "spring",
                    damping: 12,
                  }}
                  key={`${index}letter`}
                >
                  {alphabetLetter}
                </motion.p>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
};

export default Tile;
