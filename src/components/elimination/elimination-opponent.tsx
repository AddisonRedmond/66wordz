import PointsContainer from "./points-container";

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
        minWidth: "85px",
        minHeight: "20px",
      }}
      className={`flex h-fit flex-col gap-2 rounded-md border-2 border-black p-2`}
    >
      <PointsContainer points={200} pointsGoal={300} opponent={true} />
      <div className="flex h-fit items-center justify-center gap-1">
        <div className="aspect-square w-1/5 min-w-[5px] bg-emerald-500"></div>
        <div className="aspect-square w-1/5 min-w-[5px] bg-emerald-500"></div>
        <div className="aspect-square w-1/5 min-w-[5px] bg-zinc-500"></div>
        <div className="aspect-square w-1/5 min-w-[5px] bg-zinc-500"></div>
        <div className="aspect-square w-1/5 min-w-[5px] bg-emerald-500"></div>
      </div>
    </div>
  );
};

export default EliminationOpponent;
