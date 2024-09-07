import { SurvivalPlayerData } from "~/utils/survival/surivival";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

type MobileOpponentsProps = {
  opponents: SurvivalPlayerData;
};

const MobileOpponents: React.FC<MobileOpponentsProps> = (props) => {
  const getOpponents = () => {
    const opponents = Object.entries(props.opponents)
      .filter(([_, player]) => !player.eliminated) // Filter out eliminated players
      .slice(0, 7); // Take the first 7

    // Convert back to SurvivalPlayerData format
    return Object.fromEntries(opponents);
  };

  return (
    <div className="grid w-full h-24 grid-cols-4 place-items-center rounded-md border-2">
   
    </div>
  );
};

export default MobileOpponents;
