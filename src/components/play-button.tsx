import { useState } from "react";

type PlayButtonProps = {
  func: () => void;
};

const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => props.func()}
        className={`relative w-20 overflow-hidden rounded-md bg-black p-2 text-white transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 ${isHovered ? "animate-pulse" : ""} `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className={`text-xl font-semibold transition-all duration-300 ease-in-out ${isHovered ? "inline-block scale-110" : ""} `}
        >
          Play
        </span>
      </button>
    </div>
  );
};

export default PlayButton;
