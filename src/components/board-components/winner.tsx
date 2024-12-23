import { m, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Confetti from "react-confetti";

const Winner: React.FC = () => {
  const controls = useAnimation();
  const rainbowAnimation = {
    "--rainbow-color": [
      "#ff0000", // red
      "#ff9900", // orange
      "#ffff00", // yellow
      "#33cc33", // green
      "#3399ff", // blue
      "#663399", // indigo
      "#9900cc", // violet
    ],
    transition: { duration: 2, repeat: Infinity },
  };

  useEffect(() => {
    controls.start(rainbowAnimation);
  }, []);
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-md py-1 text-center shadow-md outline outline-1 outline-zinc-300">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <m.p
        animate={controls}
        style={{ color: "var(--rainbow-color)" }}
        className="text-2xl font-semibold"
      >
        Winner!
      </m.p>
      <p className="text-3xl">🏆</p>
      <p className="text-sm">
        Congratulations on your victory! You&apos;ve demonstrated your skills
        and deserve to celebrate.
      </p>
    </div>
  );
};

export default Winner;
