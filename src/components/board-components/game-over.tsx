import Confetti from "react-confetti";

const GameOver: React.FC<{ eliminated?: boolean; winner?: boolean }> = (
  props,
) => {
  if (props.eliminated) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold">OOF!</p>
        <p>Nice try, you&#39;ll get &#39;em next time</p>
      </div>
    );
  } else if (props.winner) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Confetti width={window.innerWidth} height={window.innerHeight} />
        <p className="text-2xl font-semibold">Congratulations!</p>
        <p>You&#39;re better than everyone else!</p>

        <p className="mt-5">
          <span>🏆</span>Well done!
        </p>
      </div>
    );
  }
};

export default GameOver;
