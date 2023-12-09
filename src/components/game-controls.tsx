import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

type GameControlProps = {
  joinGame: () => void;
  gameMode: string;
  setGameMode: Dispatch<SetStateAction<"MARATHON" | "ELIMINATION" | "ITEMS">>;
  setIsSolo: Dispatch<SetStateAction<boolean>>;
  isSolo: boolean;
};

const GameControls = (props: GameControlProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const handleSelectGameMode = (
    gameMode: "MARATHON" | "ELIMINATION" | "ITEMS",
  ) => {
    props.setGameMode(gameMode);
    setMenuIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-8">
        <div className="flex items-center space-x-2">
          <input
            id="solo-mode"
            onChange={() => props.setIsSolo(!props.isSolo)}
            checked={props.isSolo}
            type="checkbox"
            className="h-6 w-6 accent-violet-700 sm:h-4 sm:w-4"
          />
          <label
            className="text-lg font-medium text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="solo-mode"
          >
            Solo Game
          </label>
        </div>
      </div>
      <div className="relative">
        <button
          onClick={() => {
            setMenuIsOpen(!menuIsOpen);
          }}
          className="hover:bg h-16 w-36 rounded-full bg-[#7a20d5] px-4 font-semibold text-white duration-150 ease-in-out hover:bg-[#aa6de7]"
        >
          {props.gameMode}
        </button>
        <AnimatePresence>
          {menuIsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30, height: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                zIndex: 1,
              }}
              exit={{ opacity: 0, y: -30, height: 10 }}
              className="absolute left-0 right-0 mt-1 rounded-md border-2 border-black bg-white"
            >
              <p
                onClick={() => {
                  handleSelectGameMode("MARATHON");
                }}
                className="cursor-pointer rounded-t-md py-3 text-center font-semibold duration-300 ease-in-out hover:bg-[#E0CAF7]"
              >
                Marathon
              </p>
              <p
                onClick={() => {
                  handleSelectGameMode("ELIMINATION");
                }}
                className="cursor-pointer py-3 text-center font-semibold duration-300 ease-in-out hover:bg-[#E0CAF7]"
              >
                Elimination
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <button
          onClick={() => props.joinGame()}
          className="h-16 w-36 rounded-full border-2 border-black px-4 font-semibold duration-150 ease-in-out hover:bg-black hover:text-white"
        >
          Ready
        </button>
      </div>
    </div>
  );
};

export default GameControls;
