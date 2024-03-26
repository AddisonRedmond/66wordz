type EliminationOpponentProps = {
  opponentCount: number;
};

const EliminationOpponent: React.FC<EliminationOpponentProps> = ({
  opponentCount,
}: EliminationOpponentProps) => {
  const opponentSizePercentage = 90 / Math.sqrt(opponentCount); // Using the square root for both width and height

  return (
    <div
      style={{
        width: `${opponentSizePercentage}%`,
        // height: `${opponentSizePercentage / 2}%`,
      }}
      className={`flex items-center justify-center gap-1 h-fit rounded-md border-2 border-black p-2`}
    >
      <div className="aspect-square w-1/5 bg-black"></div>
      <div className="aspect-square w-1/5 bg-black"></div>
      <div className="aspect-square w-1/5 bg-black"></div>
      <div className="aspect-square w-1/5 bg-black"></div>
      <div className="aspect-square w-1/5 bg-black"></div>
    </div>
  );
};

export default EliminationOpponent;
