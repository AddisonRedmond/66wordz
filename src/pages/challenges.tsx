import { GetServerSideProps, NextPage } from "next";
import Header from "~/components/hearder";
import Navbar from "~/components/navbar/navbar";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Challenge from "~/components/challenge/challenge";
import ChallengeDropdown from "~/components/challenge/challenge-dropdown";
import ChallengeDropdownItem from "~/components/challenge/challenge-dropdown-item";
import { AnimatePresence } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NewChallenge from "~/components/challenge/new-challenge";
import ChallengeBoard from "~/components/challenge/challenge-board";

// implement firebase auth instead of nextauth

import useGetChallenges from "~/custom-hooks/useGetChallenges";
const Challenges: NextPage = () => {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  const premiumUser = api.getUser.isPremiumUser.useQuery();
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

  const { challenges } = useGetChallenges(data?.user.id);

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
          {startChallenge.data && data?.user.id && (
            <ChallengeBoard
              challengeId={startChallenge.data}
              userId={data?.user.id}
              handleGiveUp={handleGiveUpOrQuit}
              handleCloseChallenge={handleCloseChallenge}
            />
          )}
        </AnimatePresence>

        <Header
          isLoading={false}
          isPremiumUser={premiumUser.data?.isPremiumUser}
        />
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
                <ChallengeDropdown dropdownRef={dropdownRef}>
                  {friends.data?.length ? (
                    friendSearch.map((friend) => {
                      return (
                        <ChallengeDropdownItem
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
                </ChallengeDropdown>
              )}
            </AnimatePresence>
          </div>
          <div className="flex h-fit gap-3">
            <div className="flex items-center rounded-full bg-yellow-400 p-1 text-xs">
              <p>started</p>
            </div>
            <div className="flex items-center rounded-full bg-gray-400 p-1 text-xs">
              <p>pending</p>
            </div>
            <div className="flex items-center rounded-full bg-emerald-400 p-1 text-xs">
              <p>done</p>
            </div>
            <div className="flex items-center rounded-full bg-red-400 p-1 text-center text-xs">
              <p>gave up</p>
            </div>
            <div className="flex items-center rounded-full bg-neutral-900 p-1 text-xs text-white">
              <p>unknown</p>
            </div>

            <div className="items-center gap-1 text-sm"></div>
          </div>
          <div className="h-full overflow-hidden rounded-md border-2">
            <AnimatePresence>
              {!!list.length && (
                <NewChallenge
                  sendChallenge={sendChallenge}
                  players={list}
                  removePlayer={removePlayer}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {data?.user.id &&
                (challenges ?? []).map((challenge) => {
                  return (
                    <Challenge
                      handleStartChallenge={handleStartChallenge}
                      key={`${challenge.id}`}
                      challenge={challenge}
                      userId={data?.user.id}
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
