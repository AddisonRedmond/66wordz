import { m } from "framer-motion";
type StatusBarProps = {
  value: number;
  color: string;
  sections: number;
};
const StatusBar: React.FC<StatusBarProps> = (props: StatusBarProps) => {
  // TODO: change this to delayed children variant, rather than useEffect

  return (
    <>
      {Array.from({ length: props.sections }).map((_, index: number) => {
        return (
          <m.div
            key={index}
            style={{ width: `${98 / props.sections}%` }}
            className={`h-2 rounded-full border-2 border-zinc-300`}
          >
            <m.div
              style={{ width: `${index < props.value ? "100%" : "0%"}` }}
              className={`h-full w-full ${props.color} rounded-full duration-300 ease-in-out`}
            ></m.div>
          </m.div>
        );
      })}
    </>
  );
};

export default StatusBar;
