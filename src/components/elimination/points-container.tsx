type PointsContainerProps = {
  points: number;
  pointsGoal: number;
  opponent?: boolean
};

const PointsContainer: React.FC<PointsContainerProps> = (
  props: PointsContainerProps,
) => {
  return (

    <div className={`relative ${props.opponent? "h-1": "h-2"} rounded-full bg-zinc-300 w-full`}>
      <div className={`absolute left-0 top-0 ${props.opponent? "h-1": "h-2"} duration-300 ease-in-out w-1/2 rounded-full bg-emerald-500`}></div>
    </div>
  );
};

export default PointsContainer;
