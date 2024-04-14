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
const Challenges: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const friends = api.friends.allFriends.useQuery();
  const challenges = api.challenge.getChallenges.useQuery();
  const requestChallenge = api.challenge.requestChallenge.useMutation();
  const declineChallenge = api.challenge.declineChallege.useMutation();
  const [revealList, setRevealList] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "start">("start");
  const [list, setList] = useState<{ friendRecordId: string; name: string }[]>(
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sendChallenge = () => {
    if (list.length) {
      requestChallenge.mutate(list);
    }
  };

  const handleFriendToList = (friendId: string, name: string) => {
    // Check if the friendId already exists in the list
    const isDuplicate = list.some((item) => item.friendRecordId === friendId);

    // If it's not a duplicate, add it to the list
    if (!isDuplicate) {
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

  const removePlayer = (id: string): void => {
    setList((prevList) =>
      prevList.filter((item) => item.friendRecordId !== id),
    );
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
          <div className=" relative my-4 flex h-fit w-full items-center justify-center gap-x-2">
            <input
              ref={inputRef}
              id="friend-list"
              list="friendlist"
              className="w-full min-w-72 rounded-md border-2 p-2"
              placeholder="Enter a username"
              onClick={() => {
                handleRevealList();
              }}
            />
            <AnimatePresence>
              {revealList && (
                <ChallengeDropdown dropdownRef={dropdownRef}>
                  {friends.data?.length ? (
                    friends.data?.map((friend) => {
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
          <div className="h-full overflow-hidden rounded-md border-2">
            <AnimatePresence>
              {list.length && (
                <NewChallenge players={list} removePlayer={removePlayer} />
              )}
            </AnimatePresence>

            <Challenge />
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
