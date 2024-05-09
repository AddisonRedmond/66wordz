import { useEffect, useState } from "react";
import { and, collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { store } from "~/utils/firebase/firebase";
import { ChallengeData } from "./useGetChallengeData";

const useGetChallenges = (userId: string | undefined) => {
  const [challenges, setChallenges] = useState<ChallengeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const docRef = collection(store, "challenges");

  useEffect(() => {
    if (!userId) return; // Ensure userId is not undefined

    const threeDaysAgo = new Date().getTime() - 72 * 60 * 60 * 1000;

    const q = query(
      docRef,
      and(
        where("ids", "array-contains", userId),
        where("timeStamp", ">=", threeDaysAgo),
      ),
      limit(8)
    );

    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const updatedChallenges: ChallengeData[] = [];
        querySnapshot.forEach((doc) => {
          const challengeData = { ...doc.data(), id: doc.id } as ChallengeData;
          updatedChallenges.push(challengeData);
        });
        setChallenges(updatedChallenges);
        setError(null);
      },
      () => {
        setError(`Error fetching document`);
      },
    );

    // Handle document removals
    const removeListener = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          // Filter out the removed challenge from the state
          setChallenges((prevChallenges) =>
            prevChallenges
              ? prevChallenges.filter(
                  (challenge) => challenge.id !== change.doc.id,
                )
              : [],
          );
        }
      });
    });

    return () => {
      unsubscribe();
      removeListener();
    };
  }, [userId]);

  return { challenges, error };
};

export default useGetChallenges;
