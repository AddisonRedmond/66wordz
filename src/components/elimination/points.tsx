type PointsProps = {
  pointsGoal: number;
  totalPoints: number;
};

const Points: React.FC<PointsProps> = (props) => {
  return (
    <div className="flex w-full gap-x-1 rounded-full px-2">
      {Array.from({ length: props.totalPoints }).map((_, index: number) => {
        return (
          <div
            key={index}
            style={{ width: `${100 / props.pointsGoal - 2}%` }}
            className="bg-custom-secondary h-2 rounded-full"
          ></div>
        );
      })}
    </div>
  );
};

export default Points;
