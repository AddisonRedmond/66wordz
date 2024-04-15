import { m } from "framer-motion";
import WordContainer from "../elimination/word-container";
import GuessGrid from "./guess-grid";

type ChallengeBoardProps = {};

const ChallengeBoard: React.FC<ChallengeBoardProps> = (props) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
    >
      <div className="rounded-md bg-white p-5">
        {/* word container */}
        <WordContainer word="PENIS" revealIndex={[1, 4, 3]} />
        <GuessGrid />
        {/* keyboard */}
      </div>
    </m.div>
  );
};

export default ChallengeBoard;
