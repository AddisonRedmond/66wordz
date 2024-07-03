type PointsProps = {
  pointsGoal: number;
  totalPoints: number;
};

const Points: React.FC<PointsProps> = (props) => {
  return (
    <div className="flex w-full justify-between rounded-full">
      {Array.from({ length: props.pointsGoal }).map((_, index: number) => {
        return (
          <div
            key={index}
            style={{ width: `${100 / props.pointsGoal - 2}%` }}
            className="h-2 rounded-full  border-2"
          >
            <div
              style={{ width: `${props.totalPoints > index ? "100%" : "0%"}` }}
              className="h-full rounded-full bg-custom-secondary duration-200 ease-in-out"
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default Points;
