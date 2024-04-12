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
  const [actionType, setIsActionType] = useState<"accept" | "start">("start");
  // const friends = ["Addison Redmond", "Sydnie Redmond"];

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
                setIsActionType("start");
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
                setIsActionType("accept");
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
              return <ChallengeBadge fullName={friend.friendFullName} />;
            })}
          {actionType === "accept" &&
            friends.data?.map((friend) => {
              return <AcceptBadge />;
            })}
        </div>

        <div className="flex w-full flex-grow flex-wrap justify-center gap-3"></div>
      </div>
    </div>
  );
};

export default Challenges;
