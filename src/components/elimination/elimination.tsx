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
  return <div></div>;
};

export default Elimination;
