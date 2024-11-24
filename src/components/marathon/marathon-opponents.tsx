import { MarathonPlayerData } from "~/utils/marathon";
import OpponentsContainer from "../board-components/opponents-container";

type MarathonOpponentsProps = {
  opponents: Record<string, MarathonPlayerData>;
};

const MarathonOpponents: React.FC<MarathonOpponentsProps> = ({ opponents }) => {
  const opponentSizePercentage =
    90 /
    Math.sqrt(
      Object.entries(opponents).filter(([id, data]) => {
        return !data.eliminated;
      }).length,
    );

  return (
    <OpponentsContainer>
      {Object.entries(opponents).map(([id, data]) => {
        return (
          <div
            className="rounded-md border-2"
            style={{ width: `${opponentSizePercentage}%`, maxWidth: "450px"}}
            key={id}
          >
            <p>{id}</p>
            {JSON.stringify(data)}
          </div>
        );
      })}
    </OpponentsContainer>
  );
};

export default MarathonOpponents;
