import { m } from "framer-motion";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
type JoinLobbyProps = {
  setIsJoinLobby: (isCreateLobby: boolean) => void;
  handleJoinLobby: (lobbyId: string, passKey?: string) => void;
  errorMessage: any;
};

const JoinLobby: React.FC<JoinLobbyProps> = (props: JoinLobbyProps) => {
  const lobbyId = useRef<HTMLInputElement>(null);
  const passkey = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.errorMessage) toast.error(props.errorMessage);
  }, [props.errorMessage]);

  return (
    <m.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="flex flex-col gap-2"
    >
      <h2 className="text-xl font-semibold">Join Survival Lobby</h2>
      <div className="flex flex-col">
        <label htmlFor="lobby-id" className="font-semibold">
          Lobby Id
        </label>
        <input
          ref={lobbyId}
          id="lobby-id"
          type="text"
          className="h-10 rounded-full border-4 border-black text-center"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="passkey" className="font-semibold">
          Passkey <span className="text-xs opacity-50">(optional)</span>
        </label>
        <input
          ref={passkey}
          id="passkey"
          type="password"
          className="h-10 rounded-full border-4 border-black text-center"
        />
      </div>

      <button
        onClick={() =>
          props.handleJoinLobby(lobbyId.current!.value, passkey.current!.value)
        }
        className=" h-10 rounded-full bg-black text-xl font-medium text-white duration-150 ease-in-out hover:bg-zinc-500 disabled:cursor-not-allowed disabled:opacity-10 disabled:hover:bg-black"
      >
        Join
      </button>
      <button
        onClick={() => props.setIsJoinLobby(false)}
        className="h-10 rounded-full bg-zinc-600 text-xl font-medium text-white duration-150 ease-in-out hover:bg-zinc-400"
      >
        Cancel
      </button>
      <Toaster />
    </m.div>
  );
};

export default JoinLobby;
