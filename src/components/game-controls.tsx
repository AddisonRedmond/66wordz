import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { GameType } from "@prisma/client";

type GameControlProps = {
  joinGame: () => void;
  gameMode: GameType;
  setGameMode: Dispatch<SetStateAction<GameType>>;
  setIsSolo: Dispatch<SetStateAction<boolean>>;
  isSolo: boolean;
  games: GameType[];
};

const GameControls = (props: GameControlProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const handleSelectGameMode = (gameMode: GameType) => {
    props.setGameMode(gameMode);
    setMenuIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">

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
              {props.games.map((game: string) => {
                return (
                  <p
                    key={game}
                    onClick={() => {
                      handleSelectGameMode(game as GameType);
                    }}
                    className="cursor-pointer rounded-t-md py-3 text-center font-semibold duration-300 ease-in-out hover:bg-[#E0CAF7]"
                  >
                    {game}
                  </p>
                );
              })}
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
