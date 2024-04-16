import type { Challenge as C } from "@prisma/client";
import { m } from "framer-motion";
import { getInitials } from "~/utils/game";

type ChallengeProps = {
  challenge: C;
  handleStartChallenge: (challengeId: string) => void;
  userId?: string;
  handleGiveUpOrQuit: (challengeId: string) => void;
};

const Challenge: React.FC<ChallengeProps> = (props) => {
  function fractionToPercentage(
    numerator: number,
    denominator: number,
  ): number {
    if (denominator === 0) {
      throw new Error("Denominator cannot be zero");
    }
    return (numerator / denominator) * 100;
  }

  const quitOrDecline = () => {
    if (props.userId) {
      if (props.challenge.started.includes(props.userId)) {
        return "Quit";
      } else if (!props.challenge.started.includes(props.userId)) {
        return "Decline";
      }
    }

    return "Delete";
  };
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      exit={{ height: 0 }}
      className="flex w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex w-[80%] gap-x-2">
        {props.challenge.challengeesNames.map((name, index) => {
          return (
            <div
              key={props.challenge.challengeesIds[index]}
              className={`flex items-center gap-x-1`}
              style={{
                maxWidth: `${fractionToPercentage(1, props.challenge.challengeesNames.length)}%`,
              }}
              title={name}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-300 p-2">
                <p className="font-semibold">{getInitials(name)}</p>
              </div>
              <p className="... hidden truncate sm:block">{name}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-x-2">
        <button
          onClick={() => props.handleStartChallenge(props.challenge.id)}
          className="rounded-lg border-2 bg-black p-2 font-semibold text-white duration-150  ease-in-out hover:bg-zinc-600"
        >
          Play
        </button>
        <button
          onClick={() => {
            props.handleGiveUpOrQuit(props.challenge.id);
          }}
          className="rounded-md bg-red-700 p-2 font-medium text-white duration-150 ease-in-out hover:bg-red-600"
        >
          {quitOrDecline()}
        </button>
      </div>
    </m.div>
  );
};

export default Challenge;
