import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";

type SurvivalProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Survival: React.FC<SurvivalProps> = ({
  lobbyId,
  userId,
  gameType,
  exitMatch,
}: SurvivalProps) => {
  const gameData = useSurvialData(db, { userId, lobbyId, gameType });

  // handleKeyboard logic

  //

  return <div>{/* */}</div>;
};

export default Survival;
