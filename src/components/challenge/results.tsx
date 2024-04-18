import { ChallengeData } from "~/custom-hooks/useGetChallengeData";

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

  return (
    <div className="relative h-full p-4">
      <p className="my-4 text-center text-2xl font-semibold">Results</p>

      <div className="w-full text-center text-2xl">
        <p className="text-4xl">👑</p>
        <p>TBD</p>
      </div>

      <table className="w-full  border-collapse text-left">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="rounded-tl-lg p-4">Player</th>
            <th className="p-4">Success</th>
            <th className="p-4">Guesses</th>
            <th className="rounded-tr-lg p-4">Total Time</th>
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
                  <td className="text-wrap p-3">{player.friendFullName}</td>
                  <td className="p-3">{`${props.challengeData?.[player.friendId]?.success}`}</td>
                  <td className=" whitespace-normal text-wrap p-3 text-sm">
                    {props.challengeData?.[player.friendId]?.endTimeStamp
                      ? `${props.challengeData?.[player.friendId]?.guesses}`
                      : "Gave Up"}
                  </td>
                  <td className="text-wrap p-3">
                    {props.challengeData?.[player.friendId]?.endTimeStamp
                      ? `hrs:${hours}, mins:${minutes}, sec:${seconds}`
                      : "Gave Up"}
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
