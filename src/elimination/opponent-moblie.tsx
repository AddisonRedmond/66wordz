import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type OpponentMobileProps = {
  matchingIndex?: number[];
  points?: number;
  pointsGoal: number;
};

const OpponentMobile: React.FC<OpponentMobileProps> = (
  props: OpponentMobileProps,
) => {
  const calculateProgress = () => {
    if (props.points) {
      return Math.floor((props.points / props.pointsGoal) * 100);
    }
    return 0;
  };

  const calculateMatchingIndex = () => {
    if (props.matchingIndex) {
      return props.matchingIndex.length;
    }
    return [];
  };

  return (
    <div className="aspect-square w-10">
      <CircularProgressbar
        value={calculateProgress()}
        text={`${calculateMatchingIndex()}`}
        styles={buildStyles({
          pathColor: "green",
          textSize: "50px",
          textColor: "black",
        })}
        strokeWidth={12}
      />
    </div>
  );
};

export default OpponentMobile;
