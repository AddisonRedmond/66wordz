import { m } from "framer-motion";

const JoinLobby: React.FC<{
  joinLobby: boolean;
  setJoinLobby: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ joinLobby, setJoinLobby }) => {
  return (
    <div
      style={{ borderRadius: `${joinLobby ? ".375rem" : "9999px"}` }}
      className="cursor-pointer overflow-hidden bg-zinc-900 p-2 text-white shadow-md outline outline-1 outline-zinc-300"
    >
      <div className="flex justify-between">
        <button onClick={() => setJoinLobby(true)} className="w-full">
          Join Lobby
        </button>
        {joinLobby && <button onClick={() => setJoinLobby(false)}>X</button>}
      </div>
      <m.div
        initial={{ height: "0px", scale: 0, width: 0, opacity: 0 }}
        animate={
          joinLobby
            ? {
                height: "200px",
                scale: 1,
                width: "260px",
                padding: "1rem",
                opacity: 1,
              }
            : { scale: 0, height: "0px", width: 0, opacity: 0 }
        }
        transition={{
          duration: 0.3,
          ease: "linear",
          type: "spring",
        }}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-1">
          <p className="bg-zinc-900 text-sm">Lobby Id</p>
          <input
            placeholder="lobby id"
            className="rounded-sm p-1 text-black"
          ></input>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="bg-zinc-900 text-sm">Password</p>
          <input
            placeholder="password"
            className="rounded-sm p-1 text-black"
          ></input>

          <button>Join</button>
        </div>
      </m.div>
    </div>
  );
};

export default JoinLobby;
