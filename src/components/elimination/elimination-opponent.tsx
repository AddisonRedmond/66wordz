import PointsContainer from "./points-container";

type EliminationOpponentProps = {
  opponentCount: number;
  revealIndex?: number[];
  points: number;
  pointsGoal: number;
};

const EliminationOpponent: React.FC<EliminationOpponentProps> = ({
  opponentCount,
  ...props
}: EliminationOpponentProps) => {
  const opponentSizePercentage = 90 / Math.sqrt(opponentCount); // Using the square root for both width and height

  return (
    <div
      style={{
        width: `${opponentSizePercentage}%`,
        minWidth: "85px",
        minHeight: "20px",
        maxWidth: "300px",
      }}
      className={`flex h-fit flex-col gap-2 rounded-md border-2 border-black p-2`}
    >
      <PointsContainer points={props.points} pointsGoal={props.pointsGoal} opponent={true} />
      <div className="flex h-fit items-center justify-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className={`aspect-square w-1/5 min-w-[5px] ${props.revealIndex?.includes(index) ? "bg-emerald-500" : "bg-zinc-300"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default EliminationOpponent;
