import { m } from "framer-motion";
import { getInitials } from "~/utils/game";
import { useTimer } from "react-timer-hook";
import { ChallengeData } from "~/custom-hooks/useGetChallengeData";
import { useState } from "react";
type ChallengeProps = {
  challenge: ChallengeData;
  handleStartChallenge: (challengeId: string) => void;
  userId: string;
  handleGiveUpOrQuit: (challengeId: string) => void;
};

const Challenge: React.FC<ChallengeProps> = (props) => {
  const [infoIsOpen, setInfoIsOpen] = useState(false);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(props.challenge.timeStamp + 86400000),
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

  const playOrView = (userId: string) => {
    if (props.challenge[userId]?.completed === undefined) {
      return "Play";
    } else if (props.challenge[userId]?.completed !== undefined) {
      return "View";
    }
  };

  const getStatus = (playerId: string) => {
    if (
      props.challenge[playerId]?.timeStamp &&
      props.challenge[playerId]?.completed === undefined
    ) {
      return "#facc15";
    } else if (props.challenge[playerId]?.completed) {
      return "#34d399";
    } else if (!props.challenge[playerId]?.timeStamp) {
      return "#a1a1aa";
    } else if (
      !props.challenge[playerId]?.completed &&
      !props.challenge[playerId]?.success
    ) {
      return "#f87171";
    }
    return "#171717";
  };
  // todo: for mobile view remove play and decline replace with ... change time remaning to circular progress bar
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "80px" }}
      exit={{ height: 0 }}
      className="relative flex w-full items-center justify-between overflow-hidden border-b-2 px-4"
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
              <div
                style={{ backgroundColor: getStatus(player.friendId) }}
                className={`flex size-10 items-center justify-center rounded-full bg-zinc-300 p-2 ${getStatus(player.friendId)}`}
              >
                <p className="font-semibold">
                  {getInitials(player.friendFullName)}
                </p>
              </div>
              <p className="... hidden truncate sm:block">
                {player.friendFullName}
              </p>
            </div>
          );
        })}
      </div>

      <div className="relative flex w-fit items-center gap-x-2">
        <div className="hidden text-center text-sm sm:block">
          {!props.challenge.winner && (
            <>
              <p className="font-semibold">Time Remaing </p>
              <p className="w-fit font-medium">
                {hours}:{minutes}:{seconds}
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => props.handleStartChallenge(props.challenge.id)}
          className="rounded-lg border-2 bg-black p-2 font-semibold text-white duration-150  ease-in-out hover:bg-zinc-600"
        >
          {playOrView(props.userId)}
        </button>

        {props.challenge?.[props.userId]?.completed === undefined && (
          <button
            onClick={() => {
              props.handleGiveUpOrQuit(props.challenge.id);
            }}
            className="hidden rounded-md bg-red-700 p-2 font-medium text-white duration-150 ease-in-out hover:bg-red-600 sm:block"
          >
            {quitOrDecline()}
          </button>
        )}
        <button
          className="flex size-10 rotate-90 items-center justify-center rounded-full p-2 text-lg font-bold sm:hidden"
          onClick={() => setInfoIsOpen(true)}
        >
          ...
        </button>
      </div>
      <div
        style={{
          transform: infoIsOpen ? "translateX(0%)" : "translateX(100%)",
        }}
        className={`absolute right-0 flex h-full w-fit  items-center justify-center  gap-x-4 rounded-l-md bg-zinc-200 px-2 duration-150 ease-in-out sm:hidden`}
      >
        <div className="text-center text-sm">
          {!props.challenge.winner && (
            <>
              <p className="font-semibold">Time Remaing </p>
              <p className="w-fit font-medium">
                {hours}:{minutes}:{seconds}
              </p>
            </>
          )}
        </div>
        {props.challenge?.[props.userId]?.completed === undefined && (
          <button
            onClick={() => {
              props.handleGiveUpOrQuit(props.challenge.id);
            }}
            className="rounded-md bg-red-700 p-2 font-medium text-white duration-150 ease-in-out hover:bg-red-600 "
          >
            {quitOrDecline()}
          </button>
        )}
        <button onClick={() => setInfoIsOpen(false)}>✖️</button>
      </div>
    </m.div>
  );
};

export default Challenge;
