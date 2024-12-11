import { m, AnimatePresence } from "framer-motion";

type WordTile = {
  letter?: string;
  revealed?: boolean;
  revealedColor?: string;
  wordLength: number;
};

const WordTile: React.FC<WordTile> = ({
  letter,
  revealed,
  ...props
}: WordTile) => {
  const revealedColor = () => {
    return props.revealedColor ? props.revealedColor : "#FFFFFF";
  };

  return (
    <m.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        backgroundColor: `${revealed ? revealedColor() : "#FFFFFF"}`,
      }}
      style={{ width: `${95 / props.wordLength}%` }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.07 }}
      className={`flex aspect-square h-full items-center justify-center rounded-md bg-stone-100 text-2xl font-bold shadow-sm border-zinc-200 border-2`}
    >
      <AnimatePresence>
        {!!revealed && (
          <m.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.07 }}
          >
            {letter}
          </m.p>
        )}
      </AnimatePresence>
    </m.div>
  );
};

export default WordTile;
