import { useTimer } from "react-timer-hook";

type RoundTimerProps = {
  expiryTimeStamp: number;
};

const RoundTimer: React.FC<RoundTimerProps> = (props: RoundTimerProps) => {
    const { seconds, minutes } = useTimer({
        expiryTimestamp: new Date(props.expiryTimeStamp),
        autoStart: true,
    });

    return (
        <div className="text-center font-semibold">
            <p>Time Left</p>
            <p>{minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)}</p>
        </div>
    );
};

export default RoundTimer;
