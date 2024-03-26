import { GameType } from "@prisma/client";
import useEliminationData from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";

type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const gameData = useEliminationData(db, props);
  return (
    <div>
      <button
        onClick={() => props.exitMatch()}
        className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
      >
        QUIT
      </button>
      {/* word to guess */}

      {/* game details n stuff */}

      {/* points */}
      {/* word youre guessing input*/}
      {/* keyboard */}

      {/* opponents */}
    </div>
  );
};

export default Elimination;
