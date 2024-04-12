type PendingBadgeProps = {
  name: string;
};

const PendingBadge: React.FC<PendingBadgeProps> = (
  props: PendingBadgeProps,
) => {
  return (
    <div>
      <div className="flex h-32 w-80 flex-col gap-2 rounded-md border-2 p-4">
        <h3 className="font-semibold">Friend Request Sent</h3>
        <p>
          <span className="font-medium text-black">You sent {props.name} a friend request</span>
        </p>
      </div>
    </div>
  );
};

export default PendingBadge;
