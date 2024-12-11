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
      <div className="relative flex h-fit w-80 flex-col justify-between gap-1 rounded-md p-2 outline outline-1 outline-zinc-300">
        <h3 className="font-semibold">Request pending</h3>
        <p>
          You sent <span className="font-medium text-black">{props.name}</span>{" "}
          a friend request
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
    <div className="flex flex-col gap-1">
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
