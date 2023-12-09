import Image from "next/image";
import hourglass from "../../../public/hourglass.svg";
import { useEffect, useState } from "react";

type TotalTimeProps = {
  startTime: number;
  isTimerRunning: boolean;
};

const TotalTime: React.FC<TotalTimeProps> = (props: TotalTimeProps) => {
  const CalculateTotalTimer = () => {
    const now = new Date().getTime();
    const startTime = props.startTime;
    const difference = now - startTime;

    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours: hours, minutes: minutes, seconds: seconds };
  };

  const [time, setTime] = useState(CalculateTotalTimer());

  const { hours, minutes, seconds } = time;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (props.isTimerRunning) {
      intervalId = setInterval(() => {
        setTime(CalculateTotalTimer());
      }, 1000);
    }

    // Clear the interval on component unmount or when isTimerRunning is set to false
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [props.startTime, props.isTimerRunning]);
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        height={40}
        src={hourglass}
        alt="hour glass svg"
        className=" hidden sm:inline-block"
      />
      <p className="font-semibold">Total Time</p>
      <p className="text-xl font-semibold">{`${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</p>
      <p>Hr : Min : Sec</p>
    </div>
  );
};

export default TotalTime;
