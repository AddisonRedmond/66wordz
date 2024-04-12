const AcceptBadge = () => {
  return (
    <div className=" relative flex h-fit w-80 flex-col gap-1 rounded-md border-2 border-zinc-500 p-2">
      <p className="text-xl font-semibold">Challenged by</p>
      <p className="">Addison Redmond</p>
      <div className="flex flex-row justify-around font-medium">
        <button className="rounded-md bg-black p-2 text-white">Accept</button>
        <button className="rounded-md border-2 p-2">Decline</button>
      </div>
    </div>
  );
};

export default AcceptBadge;
