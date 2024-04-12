type ChallengeBadgeProps = {
    fullName: string;
  };
  
  const ChallengeBadgeProps: React.FC<ChallengeBadgeProps> = (props) => {
    return (
      <div className=" relative flex h-fit w-80 flex-col gap-1 rounded-md border-2 border-zinc-500 p-2">
        <div>
          <p className="font-semibold">Name:</p>
          <h3 className="... truncate text-xl font-medium">{props.fullName}</h3>
        </div>
  
        <button className="rounded-md border-2 border-zinc-300 p-2 font-medium text-black duration-150 ease-in-out hover:bg-zinc-300">
          Challenge
        </button>
      </div>
    );
  };
  
  export default ChallengeBadgeProps;
  