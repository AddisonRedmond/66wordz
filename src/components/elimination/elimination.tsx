import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import Points from "./points";

type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Elimination: React.FC<EliminationProps> = ({
  lobbyId,
  userId,
  gameType,
  exitMatch,
}: EliminationProps) => {
  const gameData = useEliminationData(db, { lobbyId, gameType });
  return (
    <div className="flex w-screen flex-grow justify-around">
      {/* opponets left side */}
      {/* hidden if game not started || if next round timer hasn't expired*/}
      <div className="flex w-1/4 flex-col items-center justify-center gap-y-3">
        {/* real word container */}
        <WordContainer word="FROM" match={["F", "O"]} />
        <Points pointsGoal={6} totalPoints={2} />
        {/* round info -> players position qualified or not, time left */}
        {/* guess container */}
        {/* keyboard */}
      </div>
      {/* opponents right side */}
    </div>
  );
};

export default Elimination;
