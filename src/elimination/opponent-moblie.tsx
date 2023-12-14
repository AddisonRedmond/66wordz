import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import person from "../../public/bust.svg";

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
    return [].length;
  };

  return (
    <div className="aspect-square w-11">
      <CircularProgressbarWithChildren
        value={calculateProgress()}
        styles={buildStyles({
          pathColor: "green",
          textSize: "50px",
          textColor: "black",
        })}
        strokeWidth={8}
      >
        <Image src={person} width={10} alt="person icon" />
        <p className=" text-sm">{calculateMatchingIndex()}</p>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default OpponentMobile;
