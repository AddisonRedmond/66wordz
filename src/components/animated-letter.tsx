import { m } from "framer-motion";
type AnimateLetterProps = {
  letters?: string | number;
  backgroundColor?: string;
};

const AnimateLetter: React.FC<AnimateLetterProps> = (
  props: AnimateLetterProps,
) => {
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  if (props.letters) {
    return (
      <m.div
        initial={{ scale: 0, opacity: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex`}
      >
        {props.letters
          .toString()
          .split("")
          .map((letter: string, index: number) => {
            return (
              <div
                key={index}
                className={`flex h-5 flex-col items-center overflow-hidden rounded-md text-sm text-black font-semibold${
                  props.backgroundColor ? props.backgroundColor : ""
                }`}
              >
                {numbers.map((alphabetLetter: string, index: number) => {
                  return (
                    <m.p
                      className="flex items-center justify-center"
                      animate={{
                        y: `-${numbers.indexOf(letter) * 20}px`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.25,
                        type: "stiff",
                        damping: 15,
                      }}
                      key={`${index}letter`}
                    >
                      {alphabetLetter}
                    </m.p>
                  );
                })}
              </div>
            );
          })}
      </m.div>
    );
  }
};

export default AnimateLetter;
