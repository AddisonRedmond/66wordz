type GameControlProps = {
  joinGame: () => void;
};

const GameControls = (props: GameControlProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <button className="h-16 w-36 rounded-full bg-stone-500 px-4 font-semibold text-white duration-150 ease-in-out hover:bg-stone-400">
          Public Game
        </button>
      </div>
      <div>
        <button
          onClick={() => props.joinGame()}
          className="h-16 w-36 rounded-full border-2 border-black px-4 font-semibold duration-150 ease-in-out hover:bg-black hover:text-white"
        >
          Ready
        </button>
      </div>
    </div>
  );
};

export default GameControls;
