import Image from "next/image";
import { ChallengeData } from "~/custom-hooks/useGetChallengeData";
import True from "../../../public/true.png";
import False from "../../../public/false.png";
import { m, useAnimation } from "framer-motion";
import { useEffect } from "react";

type ResultsProps = {
  challengeData: ChallengeData | null;
};

const Results: React.FC<ResultsProps> = (props) => {
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
    <div className="relative h-full overflow-x-auto p-4 z-10">
      <p className="my-4 text-center text-2xl font-semibold">Results</p>

      <div className="w-full text-center text-2xl">
        <p className="text-4xl">👑</p>
        <m.p animate={controls} style={{ color: "var(--rainbow-color)" }}>
          {props.challengeData?.winner?.name ?? "TBD"}
        </m.p>
      </div>

      <table className="w-full  border-collapse text-left">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="rounded-tl-lg p-3">Player</th>
            <th className="p-3">Success</th>
            <th className="p-3">Guesses</th>
            <th className="rounded-tr-lg p-3">
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
                    <Image
                      src={
                        props.challengeData?.[player.friendId]?.success
                          ? True
                          : False
                      }
                      alt={"Success or failure img"}
                      height={25}
                    />
                  </td>
                  <td className=" max-w-24 break-words text-pretty p-3 text-sm">
                    {props.challengeData?.[player.friendId]?.endTimeStamp
                      ? `${props.challengeData?.[player.friendId]?.guesses?.toString().replace(/,/g, ' ')}`
                      : "Gave Up"}
                  </td>
                  <td className="text-wrap p-3">
                    <div className="flex flex-col">
                      <p>
                        {props.challengeData?.[player.friendId]?.endTimeStamp
                          ? `${hours}:${minutes}:${seconds}`
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
  );
};

export default Results;
    