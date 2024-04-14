const Challenge = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b-2 px-4">
      <div className="flex gap-x-2">
        <div className="flex w-32 items-center gap-x-1">
          <div className="size-10 rounded-full bg-zinc-300 p-2">
            <p>AR</p>
          </div>
          <p className="hidden sm:block">Addison Redmond</p>
        </div>
      </div>

      <div>
        <button className="rounded-md border-2 bg-black p-2 text-white font-semibold">
          Play
        </button>
      </div>
    </div>
  );
};

export default Challenge;
