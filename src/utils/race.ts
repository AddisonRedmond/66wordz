import { child, DatabaseReference, update } from "firebase/database";
import {
  handleGetNewWord,
  DefaultPlayerData,
  DefaultLobbyData,
  getInitials,
  determineReveal,
  handleMatched,
  getRevealIndex,
} from "./game";
import { GameDetails } from "./types";

export interface RaceLobbyData extends DefaultLobbyData {
  round: number;
  roundTimer: number;
}

export interface RacePlayerData extends DefaultPlayerData {
  totalGuessCount: number;
}

export type RaceGameData = {
  lobbyData: RaceLobbyData;
  players: Record<string, RacePlayerData>;
};

export const createNewRaceLobby = () => {
  return {
    gameStarted: false,
    round: 1,
    gameStartTime: new Date().getTime() + 30000,
    roundTimer: new Date().getTime() + 60000,
  };
};

export const joinRaceLobby = (playerId: string, fullName?: string | null) => {
  const player: Record<string, DefaultPlayerData> = {
    [playerId]: {
      initials: getInitials(fullName) ?? "N/A",
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      eliminated: false,
      correctGuessCount: 0,
      incorrectGuessCount: 0,
    },
  };

  return player;
};

export const getUserPlacement = (
  userId: string,
  players: Record<string, DefaultPlayerData>,
) => {
  const sortedPlayers = Object.entries(players)
    .filter(([, player]) => !player.eliminated)
    .sort(([, a], [, b]) => {
      if (b.correctGuessCount !== a.correctGuessCount) {
        return b.correctGuessCount - a.correctGuessCount;
      }
      return (
        a.correctGuessCount +
        a.incorrectGuessCount -
        b.correctGuessCount +
        b.incorrectGuessCount
      ); // Fallback to totalGuesses
    })
    .map(([id]) => id);

  return {
    userPlacement: sortedPlayers.indexOf(userId) + 1,
    remainingPlayers: sortedPlayers.length,
    sortedPlayers,
  };
};
export const handleCorrectGuess = (
  userId: string,
  userData: DefaultPlayerData,
  dbRef: DatabaseReference,
  placement: {
    placement: number;
    remainingPlayers: number;
    sortedPlayers: string[];
  },
) => {
  const updatedUserObject = userData;

  const lettersToReveal = () => {
    const top25Percent = Math.floor(placement.remainingPlayers * 0.25);
    const middle60Percent = Math.floor(placement.remainingPlayers * 0.85);

    // Determine and return the tier based on user position
    if (placement.placement < top25Percent) {
      return 1; // Top 25%
    } else if (placement.placement < middle60Percent) {
      return 2; // Middle 60%
    } else {
      return 3; // Bottom 15%
    }
  };

  // if theres 5 or less players, switch to first player to guess certain number of words wins
  // top 25% one reveal
  // middle 60% two reveal
  // bottom 15% three reveal

  const newWord = handleGetNewWord();
  const { revealIndex, matches } = determineReveal(newWord, lettersToReveal());

  updatedUserObject.revealIndex = revealIndex;
  updatedUserObject.matches = { full: matches };
  updatedUserObject.correctGuessCount = updatedUserObject.correctGuessCount + 1;
  updatedUserObject.word = newWord;

  const playerRef = child(dbRef, "players");

  update(playerRef, { [userId]: updatedUserObject });
  // break users into 5ths,
  // 1 one revealed letter
  // 2 two revealed letters
  // 3 three letters revealed
  // 4 four letters revealed
};

export const handleIncorrectGuess = async (
  playerData: Record<string, DefaultPlayerData>,
  guess: string,
  dbRef: DatabaseReference,
) => {
  const [id, data] = Object.entries(playerData)[0] || [];

  if (!data?.word || !id) {
    console.log("ERROR");
    return;
  }
  const matches = handleMatched(guess, data?.word, data.matches);
  const revealIndex = getRevealIndex(data.word, guess, data.revealIndex);
  const updatedPlayerData = {
    ...data,
    matches,
    revealIndex,
    totalGuesses: data.incorrectGuessCount + 1,
  };
  const playerRef = child(dbRef, "players");

  await update(playerRef, { [id]: updatedPlayerData });
  // update the revealIndex and matches
  // increment guess counter
};

export const calcualteSpots = (playerCount: number) => {
  return Math.ceil(playerCount / 1.6);
};

export const calculateNumberOfPlayersToEliminate = (
  players: Record<string, DefaultPlayerData>,
) => {
  const nonElimiatedPlayers = Object.values(players).filter((data) => {
    return data.eliminated === false;
  });

  const spots = calcualteSpots(nonElimiatedPlayers.length);

  return nonElimiatedPlayers.length - spots;
};

export const getOrinalSuffix = (num: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = num % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${num}th`;
  }

  switch (num % 10) {
    case 1:
      return `${num}${suffixes[1]}`;
    case 2:
      return `${num}${suffixes[2]}`;
    case 3:
      return `${num}${suffixes[3]}`;
    default:
      return `${num}${suffixes[0]}`;
  }
};

export const raceGameDetails: GameDetails = [
  {
    header: "Race",
    content:
      "The players with the highest score will avoid elimination at the end of the timer",
  },
  {
    header: "Race",
    content:
      "The game will help those who are behind by revealing some letters for them",
  },
  {
    header: "Race",
    content:
      "A winner is determeined by who has the most points and fewest incorrect guesses",
  },
];
