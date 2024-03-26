import { GameType } from "@prisma/client";

type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  return (
    <div>
      <h1>Elimination</h1>
      <button onClick={() => props.exitMatch()}>Quit</button>
    </div>
  );
};

export default Elimination;
