import { Challenge } from "@prisma/client";
import { m } from "framer-motion";
import { getInitials } from "~/utils/game";

type ChallengeProps = {
  challenge: Challenge;
  handleStartChallenge: (challengeId: string) => void;
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
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      className="flex w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex w-[85%] gap-x-2">
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

      <div>
        <button
          onClick={() => props.handleStartChallenge(props.challenge.id)}
          className="rounded-md border-2 bg-black p-2 font-semibold text-white duration-150  ease-in-out hover:bg-zinc-600"
        >
          Play
        </button>
      </div>
    </m.div>
  );
};

export default Challenge;
