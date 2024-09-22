import { NextPage } from "next";
import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Challenge from "~/components/challenge/challenge";
import FriendDropdown from "~/components/challenge/friend-dropdown";
import FriendDropdownItem from "~/components/challenge/friend-dropdown-item";
import { AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import ChallengeInvite from "~/components/challenge/challenge-invite";
import ChallengeBoard from "~/components/challenge/challenge-board";

import useGetChallenges from "~/custom-hooks/useGetChallenges";
const Challenges: NextPage = () => {
  const { user } = useUser();

  const friends = api.friends.allFriends.useQuery();

  const requestChallenge = api.challenge.requestChallenge.useMutation();
  const startChallenge = api.challenge.startChallenge.useMutation();
  const giveUp = api.challenge.giveUp.useMutation();
  const [revealList, setRevealList] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [list, setList] = useState<{ friendRecordId: string; name: string }[]>(
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { challenges } = useGetChallenges(user?.id);

  const sendChallenge = async () => {
    if (list.length) {
      await requestChallenge.mutateAsync(list);
    }
    setList([]);
  };
  const handleStartChallenge = (challengeId: string) => {
    if (startChallenge.data) {
      return;
    }
    startChallenge.mutate({ challengeId: challengeId });
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleGiveUpOrQuit = async (lobbyId: string) => {
    await giveUp.mutateAsync(lobbyId);
    startChallenge.reset();
  };
  const handleFriendToList = (friendId: string, name: string) => {
    const isDuplicate = list.some((item) => item.friendRecordId === friendId);
    if (!isDuplicate && list.length < 5) {
      setList([...list, { friendRecordId: friendId, name: name }]);
    }
  };
  const handleRevealList = () => {
    if (revealList) {
      return;
    }
    setRevealList(true);
  };
  const onClickOutside = () => {
    setRevealList(false);
  };

  const removePlayer = (id: string): void => {
    setList((prevList) =>
      prevList.filter((item) => item.friendRecordId !== id),
    );
  };

  const friendSearch =
    friends.data?.filter((friend) => {
      const regex = new RegExp(inputValue.toLowerCase() ?? "");
      return regex.test(friend.friendFullName.toLowerCase());
    }) ?? [];

  const handleCloseChallenge = () => {
    startChallenge.reset();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div className="flex flex-grow flex-col">
      <Navbar />
      <div className="flex flex-grow flex-col items-center justify-evenly pb-3">
        <AnimatePresence>
          {startChallenge.data && user?.id && (
            <ChallengeBoard
              challengeId={startChallenge.data}
              userId={user?.id}
              handleGiveUp={handleGiveUpOrQuit}
              handleCloseChallenge={handleCloseChallenge}
            />
          )}
        </AnimatePresence>

        <Header isLoading={false} />
        <div className="text-center">
          <p className="text-2xl font-semibold">Challenges</p>
          <p>challenge friends to a game</p>
        </div>

        <div className="flex w-11/12 min-w-80 flex-grow flex-col gap-2 duration-150 ease-in-out xl:w-1/2">
          <div className=" relative my-4 flex h-fit w-full items-center justify-center gap-x-2">
            <input
              ref={inputRef}
              id="friend-list"
              list="friendlist"
              className="w-full min-w-72 rounded-md border-2 p-2"
              placeholder="Enter a username"
              onChange={(e) => handleInputChange(e)}
              onClick={() => {
                handleRevealList();
              }}
            />
            <AnimatePresence>
              {revealList && (
                <FriendDropdown dropdownRef={dropdownRef}>
                  {friends.data?.length ? (
                    friendSearch.map((friend) => {
                      return (
                        <FriendDropdownItem
                          key={friend.id}
                          name={friend.friendFullName}
                          image={friend.friendImage}
                          id={friend.id}
                          handleFriendToList={handleFriendToList}
                          selected={list.some(
                            (item) => item.friendRecordId === friend.id,
                          )}
                        />
                      );
                    })
                  ) : (
                    <div className=" flex h-32 items-center justify-center text-xl font-semibold">
                      <p>No friends in friends list</p>
                    </div>
                  )}
                </FriendDropdown>
              )}
            </AnimatePresence>
          </div>
          <div className="flex h-fit gap-3">
            <div className="flex items-center border-b-4 border-yellow-400 p-1 text-xs">
              <p>started</p>
            </div>
            <div className="flex items-center border-b-4 border-gray-400 p-1 text-xs">
              <p>pending</p>
            </div>
            <div className="flex items-center border-b-4 border-emerald-400 p-1 text-xs">
              <p>done</p>
            </div>
            <div className="flex items-center border-b-4 border-red-400 p-1 text-center text-xs">
              <p>gave up</p>
            </div>
            <div className="flex items-center border-b-4 border-neutral-900 p-1 text-xs">
              <p>unknown</p>
            </div>
          </div>
          <div className="h-full overflow-hidden rounded-md border-2">
            <AnimatePresence>
              {!!list.length && (
                <ChallengeInvite
                  sendChallenge={sendChallenge}
                  players={list}
                  removePlayer={removePlayer}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {user?.id &&
                (challenges ?? []).map((challenge) => {
                  return (
                    <Challenge
                      handleStartChallenge={handleStartChallenge}
                      key={`${challenge.id}`}
                      challenge={challenge}
                      userId={user?.id}
                      handleGiveUpOrQuit={handleGiveUpOrQuit}
                    />
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
