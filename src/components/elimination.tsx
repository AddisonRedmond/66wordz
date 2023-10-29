type EliminationProps = {
  lobbyId: string;
  userId: string;
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  return (
    <div className="text-black">
      <p>Elimination</p>
    </div>
  );
};

export default Elimination;
