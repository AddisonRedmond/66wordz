type PointsContainerProps = {
  points: number;
  pointsGoal: number;
  opponent?: boolean;
};

const PointsContainer: React.FC<PointsContainerProps> = (
  props: PointsContainerProps,
) => {
  const calculatePercentage = (points: number, pointsGoal: number) => {
    console.log(points, pointsGoal)
    console.log((points / pointsGoal) * 100)
    return Math.floor((points / pointsGoal) * 100);
  };

  return (
    <div
      className={`relative ${props.opponent ? "h-1" : "h-2"} w-full rounded-full bg-zinc-300`}
    >
      <div
        style={{width: `${calculatePercentage(props.points, props.pointsGoal)}%`, maxWidth: "100%"}}
        className={`absolute left-0 top-0 ${props.opponent ? "h-1" : "h-2"}  rounded-full bg-emerald-500 duration-300 ease-in-out`}
      ></div>
    </div>
  );
};

export default PointsContainer;
