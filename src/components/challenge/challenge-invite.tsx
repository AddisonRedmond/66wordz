import { m } from "framer-motion";
import Image from "next/image";
import { getInitials } from "~/utils/game";
type ChallengeInviteProps = {
  players: { friendRecordId: string; name: string }[];
  removePlayer: (friendId: string) => void;
  sendChallenge: () => void;
};

const ChallengeInvite: React.FC<ChallengeInviteProps> = (props) => {
  const send =
    "https://utfs.io/f/e8LGKadgGfdIIjmA3diWjqcbmODSYeAwFzRl0iydf8KV4Zou";
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      exit={{ height: 0 }}
      className="flex h-20 w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex w-full gap-x-2">
        {props.players.map((player) => {
          return (
            <div
              key={player.friendRecordId}
              className="relative size-10 h-fit flex-col items-center justify-center gap-2 rounded-md bg-zinc-700 px-2 py-2 text-white sm:flex sm:w-1/5 sm:flex-row sm:rounded-md"
            >
              <p className="... hidden truncate sm:block">{player.name}</p>
              <p className="sm:hidden">{getInitials(player.name)}</p>
              <button
                className=""
                onClick={() => props.removePlayer(player.friendRecordId)}
              >
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
        <Image
          loading="lazy"
          unoptimized
          alt="Send challenge"
          src={send}
          height={25}
          width={25}
        />
      </button>
    </m.div>
  );
};

export default ChallengeInvite;
