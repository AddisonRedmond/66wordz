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
export interface RacePlayerData extends DefaultPlayerData {
  eliminated: boolean;
  correctGuesses: number;
  totalGuesses: number;
}

export interface RaceLobbyData extends DefaultLobbyData {
  round: number;
  roundTimer: number;
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
  const player: Record<string, RacePlayerData> = {
    [playerId]: {
      initials: getInitials(fullName) ?? "N/A",
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      eliminated: false,
      correctGuesses: 0,
      totalGuesses: 0,
    },
  };

  return player;
};

export const getUserPlacement = (
  userId: string,
  players?: Record<string, RacePlayerData>,
) => {
  if (!players) {
    return { userPlacement: 100, remainingPlayers: 1, sortedPlayers: [""] };
  }
  const sortedPlayers = Object.entries(players)
    .filter(([, player]) => !player.eliminated)
    .sort(([, a], [, b]) => {
      if (b.correctGuesses !== a.correctGuesses) {
        return b.correctGuesses - a.correctGuesses;
      }
      return a.totalGuesses - b.totalGuesses; // Fallback to totalGuesses
    })
    .map(([id]) => id);

  return {
    userPlacement: sortedPlayers.indexOf(userId),
    remainingPlayers: sortedPlayers.length,
    sortedPlayers,
  };
};
export const handleCorrectGuess = (
  userId: string,
  userData: RacePlayerData,
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
  updatedUserObject.correctGuesses = updatedUserObject.correctGuesses + 1;
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
  playerData: Record<string, RacePlayerData>,
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
  };
  const playerRef = child(dbRef, "players");

  await update(playerRef, { [id]: updatedPlayerData });
  // update the revealIndex and matches
  // increment guess counter
};

export const calcualteSpots = (playerCount: number) => {
  return Math.ceil(playerCount / 1.6);
};
