import { useEffect } from "react";
import { GameData } from "./useGameLobbyData";

export const useOnKeyUp = (
  keyUpFunction: (e: KeyboardEvent) => void,
  dependancies: (string | GameData | null)[],
) => {
  useEffect(() => {
    window.addEventListener("keyup", keyUpFunction);

    return () => {
      window.removeEventListener("keyup", keyUpFunction);
    };
  }, [...dependancies]);
};
