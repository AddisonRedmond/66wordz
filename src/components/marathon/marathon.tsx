import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import { MarathonGameData } from "~/utils/marathon";
import Keyboard from "../board-components/keyboard";
import WordContainer from "../board-components/word-container";
import GuessContainer from "../board-components/guess-container";
import OpponentsContainer from "../board-components/opponents-container";
import LifeTimer from "./life-timer";

type MarathonProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

const Marathon: React.FC<MarathonProps> = ({ lobbyId, userId, gameType }) => {
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useGameData<MarathonGameData>(lobbyRef);
  const playerData = gameData?.players?.[userId];

  // if playerData is undefined and game started is true, error boundary

  if(gameData?.lobbyData.gameStarted && !playerData || !gameData){
    return <div>Something weird happened. Leave and try again</div>
  }

  return (
    <div className="flex h-full w-full justify-evenly">
      <OpponentsContainer>
        <p>Opponents Right</p>
      </OpponentsContainer>
      <div className="flex h-full w-1/4 flex-col justify-center gap-4">
        <LifeTimer endTime={playerData?.lifeTimer} />
        <WordContainer word={playerData?.word} />
        <GuessContainer />
        <Keyboard
          matches={playerData?.matches}
          handleKeyBoardLogic={() => console.log("keyboard event")}
        />
      </div>
      <OpponentsContainer>
        <p>Opponents Left</p>
      </OpponentsContainer>
    </div>
  );
};

export default Marathon;
