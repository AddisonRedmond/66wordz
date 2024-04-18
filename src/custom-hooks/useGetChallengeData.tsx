import { useEffect, useState } from "react";
import {
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";

type PlayerData = {
  timeStamp: string;
  endTimeStamp: string;
  guesses?: string[];
  revealIndex?: number[];
  matches?: { full: string[]; partial: string[]; none: string[] };
  completed: boolean;
  success: boolean;
};

export type ChallengeData = {
  word: string;
  ids: string[];
  id: string;
  creator: string;
  timeStamp: Date;
  winner?: string;
  players: { friendId: string; friendFullName: string }[];
} & { [userId: string]: PlayerData };

const useGetChallengeData = (
  documentReference: DocumentReference<DocumentData, DocumentData>,
) => {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      documentReference,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const challengeData = docSnapshot.data() as ChallengeData;
          setData(challengeData);
          setError(null);
        } else {
          setError("Document does not exist");
        }
      },
      () => {
        setError(`Error fetching document`);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  //   change dependency array to be the data probably. Right now the documentRef being in the array causes an infinite rerender

  return { data, error };
};

export default useGetChallengeData;
