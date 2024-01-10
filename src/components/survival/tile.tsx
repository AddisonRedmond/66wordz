import { motion, AnimatePresence } from "framer-motion";

type Tile = {
  letter?: string;
  revealed?: boolean;
};

const Tile: React.FC<Tile> = ({ letter, revealed }: Tile) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.07 }}
      className={`flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold`}
    >
      <AnimatePresence>
        {!!revealed && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.07 }}
          >
            {letter}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tile;
