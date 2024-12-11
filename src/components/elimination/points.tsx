type PointsProps = {
  pointsGoal?: number;
  totalPoints?: number;
  large?: boolean;
};

const Points: React.FC<PointsProps> = ({
  pointsGoal,
  totalPoints,
  large = false,
}) => {
  if (!pointsGoal || totalPoints === undefined) {
    return (
      <div>
        <p>An error occurred</p>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-between rounded-full">
      {Array.from({ length: pointsGoal }).map((_, index: number) => {
        return (
          <div
            key={index}
            style={{ width: `${100 / pointsGoal - 2}%` }}
            className={`${large ? "h-2" : "h-1"} rounded-full outline outline-1 outline-zinc-300`}
          >
            <div
              style={{ width: `${totalPoints > index ? "100%" : "0%"}` }}
              className="h-full rounded-full bg-custom-secondary duration-200 ease-in-out"
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default Points;
