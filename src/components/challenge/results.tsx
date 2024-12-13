import { ChallengeData } from "~/custom-hooks/useGetChallengeData";
import { m, useAnimation } from "framer-motion";
import { useEffect } from "react";
import CustomImage from "../custom-image";

type ResultsProps = {
  challengeData: ChallengeData | null;
};

const Results: React.FC<ResultsProps> = (props) => {
  const failure =
    "https://utfs.io/f/e8LGKadgGfdI59fxleGI8vZJdPyrXuwn0N1aGE2q6Yh3scoB";
  const success =
    "https://utfs.io/f/e8LGKadgGfdI1WN4Nh69TR2r5GS4vk10y3bMH6iJA7XjchVf";
  function calculateDuration(
    start: string,
    end: string,
  ): { hours: number; minutes: number; seconds: number } {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  }

  const controls = useAnimation();
  const rainbowAnimation = {
    "--rainbow-color": [
      "#ff0000", // red
      "#ff9900", // orange
      "#ffff00", // yellow
      "#33cc33", // green
      "#3399ff", // blue
      "#663399", // indigo
      "#9900cc", // violet
    ],
    transition: { duration: 2, repeat: Infinity },
  };

  useEffect(() => {
    if (props.challengeData?.winner) {
      controls.start(rainbowAnimation);
    }
  }, [props.challengeData]);

  return (
    <div className="relative z-10 h-full overflow-x-auto p-4">
      <p className="my-4 text-center text-2xl font-semibold">Results</p>
      <div className="mb-3 w-full text-center text-2xl">
        {props.challengeData?.winner?.name && (
          <div>
            <p className="text-4xl">👑</p>
            <m.p animate={controls} style={{ color: "var(--rainbow-color)" }}>
              {props.challengeData?.winner?.name}
            </m.p>
          </div>
        )}
        <div className="flex justify-center gap-x-1 font-semibold">
          {props.challengeData?.word
            .split("")
            .map((letter: string, index: number) => {
              return (
                <p
                  className="flex size-10 items-center justify-center rounded-md bg-neutral-200"
                  key={index}
                >
                  {letter}
                </p>
              );
            })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="rounded-tl-lg p-3">Player</th>
              <th className="p-3">Success</th>
              <th className="p-3">Guesses</th>
              <th className="text-wrap rounded-tr-lg p-3">
                <p>Total Time</p>
                <p className="font-medium">hr/min/sec</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.challengeData?.players.map((player) => {
              if (
                props.challengeData?.[player.friendId]?.completed !== undefined
              ) {
                const { hours, minutes, seconds } = calculateDuration(
                  `${props.challengeData?.[player.friendId]?.timeStamp}`,
                  `${props.challengeData?.[player.friendId]?.endTimeStamp}`,
                );
                return (
                  <tr
                    className="p-4 font-semibold odd:bg-gray-200"
                    key={player.friendId}
                  >
                    <td className="whitespace-normal text-wrap p-3">
                      {player.friendFullName}
                    </td>
                    <td className="p-3">
                      <CustomImage
                        src={
                          props.challengeData?.[player.friendId]?.success
                            ? success
                            : failure
                        }
                        alt={"Success or failure img"}
                        height={25}
                      />
                    </td>
                    <td className="max-w-24 text-pretty break-words p-3 text-sm">
                      {props.challengeData?.[player.friendId]?.endTimeStamp
                        ? `${props.challengeData?.[player.friendId]?.guesses?.toString().replace(/,/g, " ")}`
                        : "Gave Up"}
                    </td>
                    <td className="text-wrap p-3">
                      <div className="flex flex-col text-sm">
                        <p>
                          {props.challengeData?.[player.friendId]?.endTimeStamp
                            ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                            : "Gave Up"}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
