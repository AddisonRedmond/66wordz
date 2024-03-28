import PointsContainer from "./points-container";

type EliminationOpponentProps = {
  opponentCount: number;
  revealIndex?: number[];
  points: number;
  pointsGoal: number;
  initials?: string;
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
      className=" items-center"
    >
      <p
        style={{
          marginLeft: "5px",
          borderTop: "2px solid black",
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          borderBottom: "0px",
        }}
        className="w-fit rounded-t-md text-xs font-semibold bg-black text-white px-1"
      >
        {props?.initials ?? "N/A"}
      </p>
      <div
        className={`flex h-full w-full flex-col gap-2 rounded-md border-2 border-zinc-500 p-2`}
      >
        <PointsContainer
          points={props.points}
          pointsGoal={props.pointsGoal}
          opponent={true}
        />
        <div className="flex h-fit items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`aspect-square w-1/5 min-w-[5px] ${props.revealIndex?.includes(index) ? "bg-emerald-500" : "bg-zinc-300"}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EliminationOpponent;
