import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import FriendBadge from "~/components/friends/friend-badge";

const Friends = () => {
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const addFriend = api.friends.addNewFriend.useMutation();
  const requests = api.friends.allFriendRequests.useQuery();

  const [requestType, setRequestType] = useState<"friend" | "pending">(
    "friend",
  );

  const handleAddFriend = async () => {
    const input = inputRef.current?.value;

    const emailSchema = z.string().email();
    if (!emailSchema.safeParse(input).success) {
      return alert("Please enter a valid email");
    }

    console.log(input);
    if (inputRef.current) {
      const message = await addFriend.mutateAsync({
        email: inputRef.current.value,
      });
      if (message.success) {
        toast.success(message.message);
      } else {
        toast.error(message.message);
      }
    }
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
              requestType === "friend" ? "underline underline-offset-8  decoration-2": ""
            }
            onClick={() => {
              setRequestType("friend");
            }}
          >
            Friends
          </button>
          <button
            className={
              requestType === "pending" ? "underline underline-offset-8 decoration-2": ""
            }
            onClick={() => {
              setRequestType("pending");
            }}
          >
            Pending
          </button>
        </div>
        <div className="flex w-full flex-grow flex-wrap justify-center gap-3">
          {requestType === "pending" &&
            requests.data?.map((requestData) => {
              return (
                <FriendBadge
                  key={requestData.id}
                  name={requestData.userFullName}
                />
              );
            })}

          {requestType === "friend" && <div> </div>}
        </div>
      </div>
    </>
  );
};

export default Friends;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
