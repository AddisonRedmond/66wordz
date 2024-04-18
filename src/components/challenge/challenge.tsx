import { m } from "framer-motion";
import { getInitials } from "~/utils/game";
import { useTimer } from "react-timer-hook";
import { ChallengeData } from "~/custom-hooks/useGetChallengeData";
type ChallengeProps = {
  challenge: ChallengeData;
  handleStartChallenge: (challengeId: string) => void;
  userId?: string;
  handleGiveUpOrQuit: (challengeId: string) => void;
};

const Challenge: React.FC<ChallengeProps> = (props) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(props.challenge.timeStamp),
    autoStart: true,
  });
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
      if (props.challenge[props.userId]?.timeStamp) {
        return "QUIT";
      } else {
        return "DECLINE";
      }
    }

    return "Delete";
  };
  // todo: for mobile view remove play and decline replace with ... change time remaning to circular progress bar
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      exit={{ height: 0 }}
      className="flex w-full items-center justify-between overflow-hidden border-b-2 px-4"
    >
      <div className="flex w-[50%] gap-x-2">
        {props.challenge.players.map((player) => {
          return (
            <div
              key={player.friendId}
              className={`flex items-center gap-x-1`}
              style={{
                maxWidth: `${fractionToPercentage(1, props.challenge.players.length)}%`,
              }}
              title={player.friendFullName}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-300 p-2">
                <p className="font-semibold">
                  {getInitials(player.friendFullName)}
                </p>
              </div>
              <p className="... hidden truncate lg:block">
                {player.friendFullName}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex w-fit items-center gap-x-2 ">
        <div className="text-center text-sm">
          <p className="font-semibold">Time Remaing </p>
          <p className="w-fit font-medium">
            {hours}:{minutes}:{seconds}
          </p>
        </div>

        <button
          onClick={() => props.handleStartChallenge(props.challenge.id)}
          className="rounded-lg border-2 bg-black p-2 font-semibold text-white duration-150  ease-in-out hover:bg-zinc-600"
        >
          {props.userId !== undefined &&
          props.challenge?.[props.userId]?.completed
            ? "View"
            : "Play"}
        </button>

       {props.userId !== undefined && !props.challenge?.[props.userId]?.completed && <button
          onClick={() => {
            props.handleGiveUpOrQuit(props.challenge.id);
          }}
          className="rounded-md bg-red-700 p-2 font-medium text-white duration-150 ease-in-out hover:bg-red-600"
        >
          {quitOrDecline()}
        </button>}
      </div>
    </m.div>
  );
};

export default Challenge;
