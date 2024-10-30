import { RacePlayerData } from "~/utils/race";

type RaceOpponentsProps = {
  opponents: Record<string, RacePlayerData>;
};

const RaceOpponents: React.FC<RaceOpponentsProps> = (props) => {
  console.log(props.opponents);
  // const totalOpponents = props.ids.length;
  // const columns = Math.ceil(Math.sqrt(totalOpponents)); // Calculate the number of columns
  // const opponentSizePercentage = 50 / columns;
  return (
    <div>
      {Object.entries(props.opponents).map(([id, data]) => {
        // Destructuring as an array
        return <div key={id}></div>;
      })}
    </div>
  );
};

export default RaceOpponents;
