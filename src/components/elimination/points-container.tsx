type PointsContainerProps = {
  points: number;
  pointsGoal: number;
};

const PointsContainer: React.FC<PointsContainerProps> = (
  props: PointsContainerProps,
) => {
  return (

    <div className="relative h-2 rounded-full bg-zinc-300">
      <div className="absolute left-0 top-0 h-2 duration-300 ease-in-out w-0 rounded-full bg-emerald-500"></div>
    </div>
  );
};

export default PointsContainer;
