import { m } from "framer-motion";
import Image from "next/image";
import send from "../../../public/send.png";
type NewChallengeProps = {
  players: { friendRecordId: string; name: string }[];
  removePlayer: (friendId: string) => void;
  sendChallenge: () => void;
};

const NewChallenge: React.FC<NewChallengeProps> = (props) => {
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      exit={{ height: 0 }}
      className="flex h-20 w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex gap-x-6">
        {props.players.map((player) => {
          return (
            <div
              key={player.friendRecordId}
              className="sm:flex w-1/5 gap-2 rounded-md bg-zinc-700 px-2 py-2 text-white hidden"
            >
              <p className="... truncate">{player.name}</p>
              <button onClick={() => props.removePlayer(player.friendRecordId)}>
                ❌
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => props.sendChallenge()}
        className="rounded-full bg-zinc-600 p-3 duration-150 ease-in-out hover:bg-zinc-400"
      >
        <Image alt="Send challenge" src={send} height={25} width={25} />
      </button>
    </m.div>
  );
};

export default NewChallenge;
