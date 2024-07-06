type PointsProps = {
  pointsGoal?: number;
  totalPoints?: number;
};

const Points: React.FC<PointsProps> = ({ pointsGoal, totalPoints }) => {
  console.log({ pointsGoal, totalPoints });
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
            className="h-2 rounded-full  border-2"
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
