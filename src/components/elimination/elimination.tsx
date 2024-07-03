import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import Points from "./points";
import GameStatus from "../board-components/game-status";
import GuessContainer from "../board-components/guess-container";
import Round from "./round-counter";
import Keyboard from "../board-components/keyboard";
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
      <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3">
        <Round />
        <WordContainer word="FROM" match={[1, 3, 0]} />
        <Points pointsGoal={8} totalPoints={1} />
        <GameStatus />

        <GuessContainer word="" wordLength={4} />
        <Keyboard disabled={false} handleKeyBoardLogic={()=>{}}  />
      </div>
      {/* opponents right side */}
    </div>
  );
};

export default Elimination;
