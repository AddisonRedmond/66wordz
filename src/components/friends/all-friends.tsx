import Image from "next/image";

import Loading from "./loading";
import { api } from "~/utils/api";
import { getInitials } from "~/utils/game";

type FriendBadgeProps = {
  fullName: string;
  removeFriend: (friendId: string) => void;
  friendId: string;
  friendImage: string | null;
};

const FriendBadge: React.FC<FriendBadgeProps> = (props) => {
  return (
    <div className=" relative flex h-fit w-80 items-center justify-between gap-1 rounded-md p-2 outline outline-1 outline-zinc-300 ">
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
        className="bg-primary rounded-md px-1 py-2 text-black outline outline-1 outline-zinc-300 duration-150 ease-in-out hover:bg-zinc-900 hover:text-white"
      >
        Remove
      </button>
    </div>
  );
};

const AllFriends: React.FC<{
  handleRemoveFriend: (friendId: string) => Promise<void>;
}> = (props) => {
  const friends = api.friends.allFriends.useQuery();

  return (
    <div>
      {friends.isLoading ? (
        <Loading />
      ) : (
        friends.data?.map((friend) => {
          return (
            <FriendBadge
              key={friend.id}
              fullName={friend.friendFullName}
              removeFriend={props.handleRemoveFriend}
              friendId={friend.id}
              friendImage={friend.friendImage}
            />
          );
        })
      )}
    </div>
  );
};

export default AllFriends;
