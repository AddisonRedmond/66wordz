import AnimatedModal from "./animated-modal";

type LeaveGameProps = {
  quitGame: boolean;
  exitMatch: () => void;
  setQuitGame: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveGame: React.FC<LeaveGameProps> = ({
  quitGame,
  exitMatch,
  setQuitGame,
}) => {
  return (
    <AnimatedModal isOpen={quitGame}>
      <div className="rounded-md bg-white p-2">
        <h1 className="my-2 text-xl font-semibold">Leave Game</h1>
        <p className="my-2">Are you sure you want to leave?</p>
        <div className="my-2 flex justify-around font-medium">
          <button
            className="rounded-md bg-black p-2 text-white"
            onClick={() => exitMatch()}
          >
            Leave
          </button>
          <button
            className="rounded-md bg-[#9462C6] p-2 text-white"
            onClick={() => {
              setQuitGame(false);
            }}
          >
            Stay
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default LeaveGame;
