import {
  DefaultLobbyData,
  DefaultPlayerData,
  getInitials,
  handleGetNewWord,
} from "./game";

export interface MarathonLobbyData extends DefaultLobbyData {
  round: number;
}

export interface MarathonPlayerData extends DefaultPlayerData {
  lifeTimer?: number;
  correctGuessCount: number;
}

export type MarathonGameData = {
  lobbyData: MarathonLobbyData;
  players: Record<string, MarathonPlayerData>;
};

export const marathonLobbyData: MarathonLobbyData = {
  gameStarted: false,
  gameStartTime: new Date().getTime() + 30000,
  round: 1,
};

export const joinMarathonLobby = (userId: string, fullName: string | null) => {
  const playerData: Record<string, MarathonPlayerData> = {
    [userId]: {
      initials: fullName ? getInitials(fullName) : "N/A",
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      correctGuessCount: 0,
      eliminated: false,
    },
  };

  return playerData;
};

export const handleCorrectMarathonGuess = () => {};

export const handleIncorrectMarathonGuess = () => {};
