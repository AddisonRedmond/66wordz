import { NextPage } from "next";
import ChallengeBadge from "~/components/challenge/challenge-badge";
import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useState } from "react";
import AcceptBadge from "~/components/challenge/accept-badge";
const Challenges: NextPage = () => {
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const friends = api.friends.allFriends.useQuery();
  const challenges = api.challenge.getChallenges.useQuery();
  const requestChallenge = api.challenge.requestChallenge.useMutation();
  const declineChallenge = api.challenge.declineChallege.useMutation();
  const [actionType, setActionType] = useState<"accept" | "start">("start");

  const sendChallenge = (challengeeId: string, recordId: string) => {
    requestChallenge.mutate({ challengeeId: challengeeId, recordId: recordId });
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

        <div className="my-4 flex w-full items-center justify-center px-6">
          <label
            htmlFor="friend-list"
            className="flex h-full flex-col justify-center rounded-l-full bg-zinc-700 px-3 text-sm font-semibold text-white"
          >
            Friend's
          </label>
          <input
            id="friend-list"
            list="friendlist"
            className="w-1/2 min-w-72 rounded-r-full border-2 p-1"
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
        <button className="mb-3 rounded-md bg-black p-3 text-white">
          Send Challenge
        </button>

        <div className="flex w-1/2 min-w-80 flex-grow rounded-md border-2">
          <div className="flex h-16 w-full items-center justify-between border-b-2 px-4">
            <div className="flex items-center gap-x-1">
              <p className=" size-10 rounded-full bg-zinc-300 p-2">AR</p>
              <p>Addison Redmond</p>
            </div>

            <div>
              <button className="rounded-md bg-black p-2 text-white">
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
