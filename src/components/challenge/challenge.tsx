import { Challenge } from "@prisma/client";
import { m } from "framer-motion";
import { getInitials } from "~/utils/game";

type ChallengeProps = {
  challenge: Challenge;
};

const Challenge: React.FC<ChallengeProps> = (props) => {
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      className="flex w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex gap-x-2">
        {props.challenge.challengeesNames.map((name, index) => {
          return (
            <div
              key={props.challenge.challengeesIds[index]}
              className="flex w-32 items-center gap-x-1"
              title={name}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-300 p-2">
                <p>{getInitials(name)}</p>
              </div>
              <p className="... hidden truncate sm:block">{name}</p>
            </div>
          );
        })}
      </div>

      <div>
        <button className="rounded-md border-2 bg-black p-2 font-semibold text-white">
          Play
        </button>
      </div>
    </m.div>
  );
};

export default Challenge;
