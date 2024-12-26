import { m } from "framer-motion";

const JoinLobby: React.FC<{
  joinLobby: boolean;
  setJoinLobby: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ joinLobby, setJoinLobby }) => {
  return (
    <div
      style={{ borderRadius: `${joinLobby ? ".375rem" : "9999px"}` }}
      className="cursor-pointer overflow-hidden bg-black p-2 text-white shadow-md outline outline-1 outline-zinc-300"
    >
      <div className="flex justify-between">
        <button onClick={() => setJoinLobby(true)} className="w-full">
          Join Lobby
        </button>
        {joinLobby && <button onClick={() => setJoinLobby(false)}>X</button>}
      </div>
      <m.div
        initial={{ height: "0px", scale: 0, width: 0 }}
        animate={
          joinLobby
            ? { height: "auto", scale: 1, width: "auto" }
            : { scale: 0, height: "0px", width: 0 }
        }
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          type: "spring",
        }}
        className="flex flex-col gap-y-2"
      >
        <div className="flex flex-col">
          <p className="bg-black">Lobby Id</p>
          <input placeholder="lobby id"></input>
        </div>
        <div className="flex flex-col">
          <p className="bg-black">Password</p>
          <input placeholder="password"></input>
        </div>
      </m.div>
    </div>
  );
};

export default JoinLobby;
