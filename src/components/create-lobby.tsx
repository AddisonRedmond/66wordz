import { GameType } from "@prisma/client";
import { m } from "framer-motion";
import { useState } from "react";

type CreateLobbyProps = {
  setIsCreateLobby: (isCreateLobby: boolean) => void;
  handleCreateLobby: (
    lobbyName: string,
    enableBots: boolean,
    gameType: GameType,
    passKey?: string | undefined,
  ) => void;
  gameType: GameType;
};

const CreateLobby: React.FC<CreateLobbyProps> = (props: CreateLobbyProps) => {
  const [lobbyName, setLobbyName] = useState<string>("");
  const [passkey, setPasskey] = useState<string>("");

  const validateStringLength = (
    setStateFunc: React.Dispatch<React.SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;

    // Remove non-letter characters using a regular expression
    const alphanumericOnly = inputValue.replace(/[^A-Za-z0-9]/g, "");

    if (alphanumericOnly.length < 20) {
      setStateFunc(alphanumericOnly);
    }
  };

  return (
    <m.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="flex flex-col gap-2"
    >
      <h2 className="text-xl font-semibold">
        Create{" "}
        <span className="text-xl font-bold text-zinc-600">
          {props.gameType}
        </span>{" "}
        Lobby
      </h2>
      <div className="flex flex-col">
        <label htmlFor="lobby-name" className="font-semibold">
          Lobby Name
        </label>
        <input
          onChange={(event) => validateStringLength(setLobbyName, event)}
          value={lobbyName}
          id="lobby-name"
          type="text"
          className="h-10 rounded-full border-4 border-black text-center"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="passkey" className="font-semibold">
          Passkey <span className="text-xs opacity-50">(optional)</span>
        </label>
        <input
          onChange={(event) => validateStringLength(setPasskey, event)}
          id="passkey"
          type="password"
          className="h-10 rounded-full border-4 border-black text-center"
        />
      </div>
      <button
        disabled={lobbyName.length < 1 || lobbyName.length > 20}
        onClick={() =>
          props.handleCreateLobby(lobbyName, true, props.gameType, passkey)
        }
        className=" h-10 rounded-full bg-black text-xl font-medium text-white duration-150 ease-in-out hover:bg-zinc-500 disabled:cursor-not-allowed disabled:opacity-10 disabled:hover:bg-black"
      >
        Create
      </button>
      <button
        onClick={() => props.setIsCreateLobby(false)}
        className="h-10 rounded-full bg-zinc-600 text-xl font-medium text-white duration-150 ease-in-out hover:bg-zinc-400"
      >
        Cancel
      </button>
    </m.div>
  );
};

export default CreateLobby;
