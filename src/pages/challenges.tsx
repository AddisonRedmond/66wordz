import { NextPage } from "next";
import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import Challenge from "~/components/challenge/challenge";
const Challenges: NextPage = () => {
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const friends = api.friends.allFriends.useQuery();
  const challenges = api.challenge.getChallenges.useQuery();
  const requestChallenge = api.challenge.requestChallenge.useMutation();
  const declineChallenge = api.challenge.declineChallege.useMutation();
  const [actionType, setActionType] = useState<"accept" | "start">("start");
  const [list, setList] = useState<
    { friendId: string; name: string }[] | null
  >();
  const ref = useRef<HTMLInputElement>(null);
  const sendChallenge = (challengeeId: string, recordId: string) => {
    requestChallenge.mutate({ challengeeId: challengeeId, recordId: recordId });
  };

  const handleFriendToList = () => {
    console.log(ref.current);
  };

  return (
    <div className="flex flex-grow flex-col">
      <Navbar />
      <div className="flex flex-grow flex-col items-center justify-evenly pb-3">
        <Header
          isLoading={false}
          isPremiumUser={premiumUser.data?.isPremiumUser}
        />
        <div className="text-center">
          <p className="text-2xl font-semibold">Challenges</p>
          <p>challenge a friend to a game</p>
        </div>

        <div className="flex w-1/2 min-w-80 flex-grow flex-col gap-2">
          <div className="my-4 flex h-fit w-full items-center justify-center gap-x-2">
            <button
              onClick={() => {
                handleFriendToList();
              }}
              className="prose flex items-center justify-center rounded-md bg-black px-2 py-1  font-semibold text-white"
            >
              Add
            </button>
            <input
              ref={ref}
              id="friend-list"
              list="friendlist"
              className="w-full min-w-72 rounded-full border-2 p-1"
              placeholder="Enter a username"
            />

            <datalist id="friendlist">
              {friends.data?.map((friend) => {
                return (
                  <option
                    key={friend.id}
                    id={friend.friendId}
                    value={friend.friendFullName}
                  >
                    {friend.friendFullName}
                  </option>
                );
              })}
            </datalist>
          </div>
          <div className="h-full rounded-md border-2">
            <Challenge />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
