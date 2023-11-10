import { motion } from "framer-motion";

type PointsProps = {
  pointsTarget: number;
  totalPoints: number;
  showPoints?: boolean;
};

const Points: React.FC<PointsProps> = (props: PointsProps) => {
  const CalcualtePointsPrecentage = () => {
    return (props.totalPoints / props.pointsTarget) * 100;
  };
  return (
    <div>
      {props.showPoints && (
        <p className="text-center font-semibold">{`${props.totalPoints} out of ${props.pointsTarget}`}</p>
      )}
      <motion.div
        animate={{ width: `${CalcualtePointsPrecentage()}%`, maxWidth: "100%" }}
        className={`${
          props.showPoints ? "h-3" : "h-1"
        } rounded-full bg-green-600`}
      ></motion.div>
    </div>
  );
};

export default Points;
