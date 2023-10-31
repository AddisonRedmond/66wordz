import { useEffect } from "react";

export const useOnKeyUp = (keyUpFunction: () => void, dependancies: []) => {
  useEffect(() => {
    window.addEventListener("keyup", keyUpFunction);

    return () => {
      window.removeEventListener("keyup", keyUpFunction);
    };
  }, [...dependancies]);
};
