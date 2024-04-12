type FriendBadgeProps = {
  fullName: string;
};

const FriendBadge: React.FC<FriendBadgeProps> = (props) => {
  return (
    <div className="h-fit w-72 rounded-md border-2 p-2 flex flex-col gap-1">
      <h3 className="... truncate text-xl font-medium">{props.fullName}</h3>
      <div className=" flex justify-around">
        <button className="font-medium rounded-md bg-black p-2 text-white">
          Challenge
        </button>
        <button className="font-medium rounded-md bg-black p-2 text-white">
          Remove
        </button>
      </div>
    </div>
  );
};

export default FriendBadge;
