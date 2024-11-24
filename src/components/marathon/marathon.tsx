import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import { MarathonGameData, MarathonPlayerData } from "~/utils/marathon";
import Keyboard from "../board-components/keyboard";
import WordContainer from "../board-components/word-container";
import GuessContainer from "../board-components/guess-container";
import OpponentsContainer from "../board-components/opponents-container";
import LifeTimer from "./life-timer";
import MarathonOpponents from "./marathon-opponents";
import Eliminated from "../board-components/eliminated";

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

  // TODO: make a custom return function, that either returns an error like this or returns the component
  if ((gameData?.lobbyData.gameStarted && !playerData) || !gameData) {
    return <div>Something weird happened. I would leave and try again</div>;
  }

  const getHalfOfOpponents = () => {
    const fakeOpponent: Record<string, MarathonPlayerData> = {
      player1: {
        eliminated: false,
        correctGuessCount: 0,
        matches: { full: [], partial: [], none: [] },
        word: "CLEAR",
        initials: "ALR",
      },
    };
    return fakeOpponent;
  };

  return (
    <div className="flex h-full w-full justify-evenly">
      <MarathonOpponents opponents={getHalfOfOpponents()} />
      <div className="flex h-full w-1/4 flex-col justify-center gap-4">
        <LifeTimer endTime={playerData?.lifeTimer} />
        <WordContainer word={playerData?.word} />
        <GuessContainer />
        <Keyboard
          matches={playerData?.matches}
          handleKeyBoardLogic={() => console.log("keyboard event")}
          disabled={!gameData.lobbyData.gameStarted}
        />
      </div>
      <MarathonOpponents opponents={getHalfOfOpponents()} />
    </div>
  );
};

export default Marathon;
