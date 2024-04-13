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
        <div className="font-semibold">
          <p className="text-2xl">Challenge</p>
          <div className="flex justify-between">
            <button
              onClick={() => {
                setActionType("start");
              }}
              className={
                actionType === "start"
                  ? "underline decoration-2 underline-offset-8"
                  : ""
              }
            >
              Start
            </button>
            <button
              onClick={() => {
                setActionType("accept");
              }}
              className={
                actionType === "accept"
                  ? "underline decoration-2 underline-offset-8"
                  : ""
              }
            >
              Accept
            </button>
          </div>
        </div>
        <div className="my-4">
          {actionType === "start" &&
            friends.data?.map((friend) => {
              return (
                <ChallengeBadge
                  key={friend.id}
                  fullName={friend.friendFullName}
                  sendChallenge={sendChallenge}
                  recordId={friend.id}
                  friendId={friend.friendId}
                />
              );
            })}
          {actionType === "accept" &&
            challenges.data?.map((challenge) => {
              return (
                <AcceptBadge
                  key={challenge.id}
                  challengerName={challenge.challengerFullName}
                  challengerId={challenge.challenger}
                />
              );
            })}
        </div>

        <div className="flex w-full flex-grow flex-wrap justify-center gap-3"></div>
      </div>
    </div>
  );
};

export default Challenges;
