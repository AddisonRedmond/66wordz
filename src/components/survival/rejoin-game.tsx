type RejoinGameProps = {
  rejoin: () => void;
  decline: () => void;
};

const RejoinGame: React.FC<RejoinGameProps> = ({
  rejoin,
  decline,
  ...props
}) => {
  return (
    <div className="flex max-w-56 flex-col gap-2">
      <p className="text-xl font-semibold">Rejoin Lobby?</p>
      <p className="text-sm">Would you like to rejoin your previous game?</p>
      <div className="flex w-full justify-between">
        <button
          onClick={() => rejoin()}
          className="w-14 rounded-md bg-black p-2 text-white duration-150 ease-in-out hover:bg-zinc-800"
        >
          Yes
        </button>
        <button
          onClick={() => decline()}
          className="w-14 rounded-md border-2 p-2 duration-150 ease-in-out hover:bg-zinc-200"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default RejoinGame;
