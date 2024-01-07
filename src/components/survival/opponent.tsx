import {
  CircularProgressbarWithChildren,
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

type OpponentProps = {
  health?: number;
  shield?: number;
};

const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  return (
    <div className="w-20">
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathColor: "#38BDF8",
          textSize: "50px",
          textColor: "black",
        })}
        value={props.shield ?? 0}
      >
        <div className=" w-16">
          <CircularProgressbarWithChildren
            styles={buildStyles({
              pathColor: "#4ADE80",
              textSize: "50px",
              textColor: "black",
            })}
            value={props.health ?? 0}
          >
            <div className="flex flex-col justify-center items-center font-semibold">
                <p className="text-sm text-sky-400">{props.health}</p>
                <p className="text-sm text-green-400">{props.shield}</p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default Opponent;
