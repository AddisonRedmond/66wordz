import Loading from "./loading";
import { Requests } from "@prisma/client";

type RequestBadge = {
  name: string;
  requestId: string;
  handleRequest: (requestId: string, accept: boolean) => Promise<void>;
};

const RequestBadge: React.FC<RequestBadge> = (props) => {
  return (
    <div className="flex h-fit w-80 items-center gap-2 rounded-md p-4 outline outline-1 outline-zinc-300">
      <div className="">
        <p>
          <span className="... truncate font-medium text-black">
            {props.name}
          </span>{" "}
          sent you a friend request
        </p>
      </div>

      <div className="flex flex-col justify-between gap-y-2">
        <button
          onClick={() => {
            props.handleRequest(props.requestId, true);
          }}
          className="bg-primary rounded-md  p-1 text-black outline outline-1 outline-zinc-300 duration-150 ease-in-out hover:bg-zinc-900 hover:text-white"
        >
          Accept
        </button>
        <button
          className="rounded-md  bg-red-400 p-1 text-white duration-150 ease-in-out hover:bg-red-300"
          onClick={() => {
            props.handleRequest(props.requestId, false);
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

const AllRequests: React.FC<{
  handleAcceptRequest: (requestId: string, accept: boolean) => Promise<void>;
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
            <RequestBadge
              key={request.id}
              name={request.userFullName}
              requestId={request.id}
              handleRequest={props.handleAcceptRequest}
            />
          );
        })
      )}
    </div>
  );
};

export default AllRequests;
