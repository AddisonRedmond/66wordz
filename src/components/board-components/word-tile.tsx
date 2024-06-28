import { m, AnimatePresence } from "framer-motion";

type WordTile = {
  letter?: string;
  revealed?: boolean;
  revealedColor?: string;
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
      exit={{ scale: 0 }}
      transition={{ duration: 0.07 }}
      className={`flex aspect-square h-[6vh] min-h-11 items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-2xl font-bold`}
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
