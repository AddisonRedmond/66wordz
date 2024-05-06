import Image from "next/image";
import { getInitials } from "~/utils/game";

type FriendBadgeProps = {
  fullName: string;
  removeFriend: (friendId: string) => void;
  friendId: string;
  friendImage: string | null;
};

const FriendBadge: React.FC<FriendBadgeProps> = (props) => {
  return (
    <div className=" relative flex h-fit w-80 items-center justify-between gap-1 rounded-md border-2 p-2 ">
      {props.friendImage ? (
        <Image
          src={props.friendImage}
          alt="friend avatar image"
          width={50}
          height={50}
          className="rounded-full"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full bg-zinc-500 font-medium text-white">
          <p>{getInitials(props.fullName)}</p>
        </div>
      )}
      <h3 className="... truncate font-medium">{props.fullName}</h3>

      <button
        onClick={() => {
          props.removeFriend(props.friendId);
        }}
        className="bg-primary rounded-md px-1 py-2 text-white duration-150 ease-in-out hover:bg-purple-400"
      >
        Remove
      </button>
    </div>
  );
};

export default FriendBadge;
