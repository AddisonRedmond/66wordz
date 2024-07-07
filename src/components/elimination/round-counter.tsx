const Round: React.FC<{ round: number; finalRound: Boolean }> = (props) => {
  return (
    <div>
      <h2 className=" text-2xl font-bold">
        {props.finalRound ? "Final Round" : `Round ${props.round}`}
      </h2>
    </div>
  );
};

export default Round;
