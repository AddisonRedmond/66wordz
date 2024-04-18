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
    console.log(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  }

  return (
    <div className="p-2">
      <p className="my-4 text-center text-2xl font-semibold">Results</p>

      <table className="w-full text-center">
        <tr>
          <th>Player</th>
          <th>Completed</th>
          <th>Success</th>
          <th>Guesses</th>
          <th>Total Time</th>
        </tr>

        {props.challengeData?.players.map((player) => {
          if (props.challengeData?.[player.friendId]?.completed) {
            const { hours, minutes, seconds } = calculateDuration(
              `${props.challengeData?.[player.friendId]?.timeStamp}`,
              `${props.challengeData?.[player.friendId]?.endTimeStamp}`,
            );
            return (
              <tr>
                <td>{player.friendFullName}</td>
                <td>{`${props.challengeData?.[player.friendId]?.completed}`}</td>
                <td>{`${props.challengeData?.[player.friendId]?.success}`}</td>
                <td className=" text-wrap">{`${props.challengeData?.[player.friendId]?.guesses}`}</td>
                <td>{`hrs:${hours}, mins:${minutes}, sec:${seconds}`}</td>
              </tr>
            );
          }
        })}
      </table>
    </div>
  );
};

export default Results;
