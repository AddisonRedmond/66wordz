type FriendBadgeProps = {
  name: string;
};

const FriendBadge: React.FC<FriendBadgeProps> = (props) => {
  return (
    <div className="flex w-fit h-fit flex-col gap-2 rounded-md border-2 p-4">
      <h3 className="font-semibold">New Friend Request</h3>
      <p>
        <span className="font-medium text-black">{props.name}</span> sent you a
        friend request
      </p>

      <div className="flex w-full justify-between font-medium">
        <button className="rounded-md bg-black p-2 text-white">Accept</button>
        <button className="rounded-md border-2 p-2">Reject</button>
      </div>
    </div>
  );
};

export default FriendBadge;
