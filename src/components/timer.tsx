import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type TimerProps = {
  expiryTimestamp: Date;
  endGame?: () => void;
  opponent: boolean;
};

const Timer: React.FC<TimerProps> = ({
  expiryTimestamp,
  endGame,
  opponent,
}: TimerProps) => {
  const {
    seconds,
    minutes,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: endGame ? ()=> endGame() : ()=>console.log("Timer ended"),
  });

  useEffect(() => {
    restart(expiryTimestamp);
  }, [expiryTimestamp]);

  const toTotalSeconds = (mins: number, seconds: number) => {
    const totalSeconds = mins * 60 + seconds;

    const progress = (totalSeconds / 180) * 100;

    return progress > 100 ? 100 : progress;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${
          opponent ? "my-0" : "my-3"
        } flex flex-col justify-center text-2xl font-semibold`}
      >
        {!opponent && (
          <div className="mx-1 text-black">
            <span>{minutes} Mins</span> <span>{seconds} Secs</span>
          </div>
        )}
        <div className="h-1 w-[100%] bg-white">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${toTotalSeconds(minutes, seconds)}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className="rounded-full ease-in-out"
            style={{
              height: opponent ? "100% " : "10px",
              backgroundColor: "green",
            }}
          ></motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Timer;
