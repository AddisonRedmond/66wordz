type DisqualfiedProps = {
  handleClick: () => void;
};

const Disqualfied: React.FC<DisqualfiedProps> = (props: DisqualfiedProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-around">
      <p className="text-xl font-bold">Disqualfied ☹</p>
      <p className="text-center">You have been disqualfied. Better luck next time!</p>
      <button
        onClick={() => {
          props.handleClick();
        }}
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
      >
        Exit Match
      </button>
    </div>
  );
};

export default Disqualfied;
