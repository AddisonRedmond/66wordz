import { eliminationGameDetails } from "~/utils/elimination";
import { marathonGameDetails } from "~/utils/marathon";
import { raceGameDetails } from "~/utils/race";
import Carousel from "../carousel/carousel";
import CarouselHeader from "../carousel/carousel-header";
import PlayButton from "../play-button";
import { GameType } from "@prisma/client";

type InstructionsProps = {
  instructions?: GameType;
  setInstructions: (value: GameType | undefined) => void;
  handleQuickPlay: (gameMode: GameType) => void;
};

const Instructions: React.FC<InstructionsProps> = ({
  instructions,
  setInstructions,
  handleQuickPlay,
}) => {
  const allInstructions = {
    MARATHON: marathonGameDetails,
    RACE: raceGameDetails,
    ELIMINATION: eliminationGameDetails,
    SURVIVAL: [{ header: "", content: "" }],
  };
  return (
    <div className="flex flex-col gap-5">
      {instructions && (
        <>
          <Carousel
            slides={allInstructions?.[instructions]}
            header={
              <CarouselHeader
                header={instructions}
                closeFunc={() => setInstructions(undefined)}
              />
            }
          />
          <PlayButton func={() => handleQuickPlay(instructions)} />
        </>
      )}
    </div>
  );
};

export default Instructions;
