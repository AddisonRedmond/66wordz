import { useEffect } from "react";

export const useOnKeyUp = (
  keyUpFunction: (e: KeyboardEvent) => Promise<void>,
  dependancies: [],
) => {
  useEffect(() => {
    window.addEventListener("keyup", keyUpFunction);

    return () => {
      window.removeEventListener("keyup", keyUpFunction);
    };
  }, [...dependancies]);
};
