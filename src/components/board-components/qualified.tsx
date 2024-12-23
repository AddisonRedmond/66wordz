const Qualified = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-md py-1 text-center shadow-md outline outline-1 outline-zinc-300">
      <p className="text-2xl font-semibold">Congratulations!</p>
      <p className="text-sm">
        {
          "You've qualified to move onto the next round. Please wait for other players to finish."
        }
      </p>
    </div>
  );
};

export default Qualified;
