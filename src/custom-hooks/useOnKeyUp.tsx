import { useEffect } from "react";

export const useOnKeyUp = (
  keyUpFunction: (e: KeyboardEvent) => void,
  dependancies: any[],
) => {
  useEffect(() => {
    window.addEventListener("keyup", keyUpFunction);

    return () => {
      window.removeEventListener("keyup", keyUpFunction);
    };
  }, [...dependancies]);
};
