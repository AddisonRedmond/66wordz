import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";

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
    <div className="flex flex-grow flex-col">
      Elimination
      {/* opponets left side */}


      {/* hidden if game not started || if next round timer hasn't expired*/}
      <div>
        {/* real word container */}
        {/* round info -> players position qualified or not, time left */}
        {/* guess container */}
        {/* keyboard */}
      </div>


      {/* opponents right side */}
    </div>
  );
};

export default Elimination;
