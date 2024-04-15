import { m } from "framer-motion";
import WordContainer from "../elimination/word-container";
import GuessGrid from "./guess-grid";
import Keyboard from "../keyboard";

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
      <div className="flex sm:w-1/2 max-h-[90vh] flex-col gap-5 rounded-md bg-white p-5 items-center justify-center">
        {/* word container */}
        <WordContainer word="PENIS" revealIndex={[1, 4, 3]} />
        <GuessGrid />
        {/* keyboard */}
        <Keyboard disabled={false} handleKeyBoardLogic={()=>{}} />
      </div>
    </m.div>
  );
};

export default ChallengeBoard;
