import Image from "next/image";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type MarathonGameInfoProps = {
  endTime: number;
  remainingGuesses: number;
  additionalTime?: number;
};

const MarathonGameInfo: React.FC<MarathonGameInfoProps> = ({
  endTime,
  ...props
}) => {
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(endTime),
  });

  useEffect(() => {
    restart(new Date(endTime));
  }, [endTime]);

  return (
    <div className="mx-auto flex w-2/3 items-center justify-center gap-x-5 rounded-lg bg-gray-100 p-4 text-lg font-semibold shadow-md">
      <div className="flex w-1/3 items-center justify-center gap-x-1 text-[#7233CA]">
        <span>
          <Image
            height={15}
            width={15}
            alt="question mark image"
            src="https://utfs.io/f/e8LGKadgGfdIEl2Py3q84OC5cU3GY6ZanoMtWuLQwsKVTzFJ"
            unoptimized
            title="Remaining guesses"
          />
        </span>

        <p>{props.remainingGuesses}</p>
      </div>
      <div className="flex w-1/3 flex-grow items-center gap-1">
        <span className="aspect-square">
          <Image
            src="https://utfs.io/f/e8LGKadgGfdIj6AGUvybY5N3wIvPhWRso1lep8jrEmnVxTQf"
            unoptimized
            height={15}
            width={15}
            alt="stop watch image"
            title="Time left before eliminated"
          />
        </span>

        <p className="w-1/3">{`${minutes}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
      <div>
        <p className="text-emerald-600">+ {props?.additionalTime ?? 0}s</p>
      </div>
    </div>
  );
};

export default MarathonGameInfo;
