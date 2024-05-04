import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import RequestBadge from "~/components/friends/request-badge";
import PendingBadge from "~/components/friends/pending-badge";
import FriendBadge from "~/components/friends/friend-badge";

const Friends = () => {
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const addFriend = api.friends.addNewFriend.useMutation();
  const newRequests = api.friends.allRequests.useQuery();
  const sent = api.friends.allPending.useQuery();
  const friends = api.friends.allFriends.useQuery();
  const acceptRequest = api.friends.handleFriendRequest.useMutation();
  const removeFriend = api.friends.removeFriend.useMutation();

  const [requestType, setRequestType] = useState<
    "friend" | "pending" | "request"
  >("friend");

  const handleAddFriend = async () => {
    const input = inputRef.current?.value;
    const emailSchema = z.string().email();
    if (!emailSchema.safeParse(input).success) {
      return alert("Please enter a valid email");
    }
    if (inputRef.current) {
      const message = await addFriend.mutateAsync({
        email: inputRef.current.value,
      });
      if (message?.success) {
        toast.success(message.message);
        sent.refetch();
      } else {
        toast.error(message.message);
      }
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    await removeFriend.mutateAsync(friendId);
    friends.refetch();
  };

  const handleAcceptRequest = async (requestId: string, accept: boolean) => {
    await acceptRequest.mutateAsync({ requestId: requestId, accept: accept });
    friends.refetch();
    newRequests.refetch();
    sent.refetch();
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex min-w-[375px] flex-grow flex-col items-center justify-evenly">
        <Header
          isLoading={false}
          desktopOnly={false}
          isPremiumUser={premiumUser.data?.isPremiumUser}
        />
        <h1 className="text-2xl font-bold">Friends</h1>

        <div className="flex flex-col gap-2 font-medium">
          <label htmlFor="add-friend">Add Friend</label>
          <input
            id="add-friend"
            type="text"
            className="rounded-full border-2 border-zinc-400 p-2"
            placeholder="Email"
            ref={inputRef}
          ></input>
          <button
            onClick={() => handleAddFriend()}
            className="rounded-full bg-zinc-900 p-2 text-white duration-150 ease-in-out hover:bg-zinc-700"
          >
            Add Friend
          </button>
        </div>
        <div className="flex gap-3 py-4 font-semibold">
          <button
            className={
              requestType === "friend"
                ? "underline decoration-2  underline-offset-8"
                : ""
            }
            onClick={() => {
              setRequestType("friend");
            }}
          >
            Friends
          </button>
          <button
            className={
              requestType === "request"
                ? "underline decoration-2 underline-offset-8"
                : ""
            }
            onClick={() => {
              setRequestType("request");
            }}
          >
            New
          </button>
          <button
            className={
              requestType === "pending"
                ? "underline decoration-2 underline-offset-8"
                : ""
            }
            onClick={() => {
              setRequestType("pending");
            }}
          >
            Sent
          </button>
        </div>
        <div className="flex w-full flex-grow flex-wrap justify-center gap-3 py-2">
          {requestType === "pending" &&
            sent.data?.map((pendingData) => {
              return (
                <PendingBadge
                  key={pendingData.id}
                  name={pendingData.friendFullName}
                />
              );
            })}
          {requestType === "request" &&
            newRequests.data?.map((requestData) => {
              return (
                <RequestBadge
                  key={requestData.id}
                  name={requestData.userFullName}
                  requestId={requestData.id}
                  handleRequest={handleAcceptRequest}
                />
              );
            })}
          {requestType === "friend" &&
            friends.data?.map((friend) => {
              return (
                <FriendBadge
                  key={friend.id}
                  fullName={friend.friendFullName}
                  removeFriend={handleRemoveFriend}
                  friendId={friend.id}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Friends;
