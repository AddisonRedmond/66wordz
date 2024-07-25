import Loading from "./loading";
import { Requests } from "@prisma/client";

type PendingBadgeProps = {
  name: string;
};

const PendingBadge: React.FC<PendingBadgeProps> = (
  props: PendingBadgeProps,
) => {
  return (
    <div>
      <div className=" relative flex h-fit w-80 flex-col justify-between gap-1 rounded-md p-2 outline outline-1 outline-zinc-300 ">
        <h3 className="font-semibold">Friend Request Sent</h3>
        <p>
          <span className="font-medium text-black">
            You sent {props.name} a friend request
          </span>
        </p>
      </div>
    </div>
  );
};

const AllSentRequests: React.FC<{
  isLoading: boolean;
  data: Requests[] | undefined;
}> = (props) => {
  return (
    <div>
      {props.isLoading ? (
        <Loading />
      ) : (
        props.data?.map((request) => {
          return (
            <PendingBadge key={request.id} name={request.friendFullName} />
          );
        })
      )}
    </div>
  );
};

export default AllSentRequests;
