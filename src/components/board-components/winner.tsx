import Confetti from "react-confetti";

const Winner: React.FC<{}> = (props) => {
  return (
    <div className="rounded-md border-2 p-2">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h2 className="my-2 text-2xl font-semibold">You Won!</h2>
      <p>
        Congratulations on your victory! You've demonstrated your skills and
        deserve to celebrate.
      </p>
    </div>
  );
};

export default Winner;
