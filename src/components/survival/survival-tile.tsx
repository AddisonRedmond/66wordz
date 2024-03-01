import { motion, AnimatePresence } from "framer-motion";

type SurvivalTile = {
  letter?: string;
  revealed?: boolean;
  revealedColor?: string;
};

const SurvivalTile: React.FC<SurvivalTile> = ({
  letter,
  revealed,
  ...props
}: SurvivalTile) => {
  const revealedColor = () => {
    return props.revealedColor ? props.revealedColor : "#FFFFFF";
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        backgroundColor: `${revealed ? revealedColor() : "#FFFFFF"}`,
      }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.07 }}
      className={`flex aspect-square h-[5vh] min-h-11 items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-2xl font-bold`}
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

export default SurvivalTile;
