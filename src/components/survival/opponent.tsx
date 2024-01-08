import {
  CircularProgressbarWithChildren,
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

type OpponentProps = {
  playerId: string;
  opponentData?: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
  };
  attack: (playerId: string) => void;
};

const Opponent: React.FC<OpponentProps> = (props: OpponentProps) => {
  const { health, shield, eliminated } = props.opponentData ?? {
    health: 0,
    shield: 0,
    eliminated: false,
  };
  return (
    <div
      onClick={() => {
        props.attack(props.playerId);
      }}
      className={`w-20 ${eliminated ? "opacity-50" : "opacity-100"}`}
    >
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathColor: "#38BDF8",
          textSize: "50px",
          textColor: "black",
        })}
        value={shield}
      >
        <div className=" w-16">
          <CircularProgressbarWithChildren
            styles={buildStyles({
              pathColor: "#4ADE80",
              textSize: "50px",
              textColor: "black",
            })}
            value={health}
          >
            <div className="flex flex-col items-center justify-center font-semibold">
              {eliminated ? (
                <p>❌</p>
              ) : (
                <>
                  <p className="text-sm text-sky-400">{health}</p>
                  <p className="text-sm text-green-400">{shield}</p>
                </>
              )}
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default Opponent;
