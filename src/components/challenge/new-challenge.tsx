import { m } from "framer-motion";
import Image from "next/image";
import send from "../../../public/send.png";
type NewChallengeProps = {
  players: { friendId: string; name: string }[];
  removePlayer: (friendId: string) => void;
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
              key={player.friendId}
              className="flex w-36 gap-2 rounded-md bg-zinc-700 px-2 py-2 text-white"
            >
              <p className="... truncate">{player.name}</p>
              <button onClick={() => props.removePlayer(player.friendId)}>
                ❌
              </button>
            </div>
          );
        })}
      </div>

      <button className="rounded-full bg-zinc-600 p-3">
        <Image alt="Send challenge" src={send} height={25} width={25} />
      </button>
    </m.div>
  );
};

export default NewChallenge;
