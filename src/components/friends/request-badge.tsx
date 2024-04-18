type RequestBadge = {
  name: string;
  requestId: string;
  handleRequest: (reqId: string, accept: boolean) => void;
};

const RequestBadge: React.FC<RequestBadge> = (props) => {
  return (
    <div className="flex h-fit w-80 flex-col gap-2 rounded-md border-2 p-4">
      <h3 className="font-semibold">New Friend Request</h3>
      <p>
        <span className="... truncate font-medium text-black">
          {props.name}
        </span>
        sent you a friend request
      </p>

      <div className="flex w-full justify-between font-medium">
        <button
          onClick={() => {
            props.handleRequest(props.requestId, true);
          }}
          className="rounded-md bg-black p-2 text-white"
        >
          Accept
        </button>
        <button
          className="rounded-md border-2 p-2"
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

export default RequestBadge;
