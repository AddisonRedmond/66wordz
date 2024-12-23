import { m, AnimatePresence } from "framer-motion";

const Eliminated: React.FC = () => {
  return (
    <AnimatePresence>
      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="py-1 w-full max-w-md rounded-md bg-red-600 text-white"
      >
        <m.div
          className="text-center text-3xl"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          💀
        </m.div>

        <h2 className="mb-4 text-center text-3xl font-bold">Game Over</h2>
        <p className="mb-6 text-center text-xl">
          {"Sorry. You've been eliminated!"}
        </p>
      </m.div>
    </AnimatePresence>
  );
};

export default Eliminated;
