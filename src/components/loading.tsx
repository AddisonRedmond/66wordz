import { motion } from "framer-motion";

const Loading: React.FC = () => {
  const container = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1,
      },
    },
  };
  const tile = {
    visible: {
      rotateZ: [-360, 0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, -20, 0],
    },
  };

  return (
    <>
      <motion.div
        className="flex justify-center gap-2"
        initial={{ scale: 0, opacity: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        animate="visible"
        variants={container}
      >
        {"LOADING".split("").map((letter: string, index: number) => {
          return (
            <motion.div
              key={index}
              variants={tile}
              transition={{
                repeat: Infinity,
                repeatDelay: 1.5,
                duration: 3,
                times: [0, 0.15, 0.2, 0.65, 0.7, 0.75],
              }}
              className="flex aspect-square w-[7vh] flex-col items-center overflow-hidden rounded-md bg-[#9462C6] text-[6vh] font-semibold text-white"
            >
              <p
                className="flex h-full items-center justify-center"
                key={`${index}letter`}
              >
                {letter}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default Loading;
