import { m } from "framer-motion";
type StatusBarProps = {
  value?: number;
  color: string;
  sections: number;
};
const StatusBar: React.FC<StatusBarProps> = (props: StatusBarProps) => {
  // TODO: change this to delayed children variant, rather than useEffect

  const getWidth = (index: number, value?: number) => {
    if (!value || value < index + 1) {
      return "0%";
    }
    return "100%";
  };

  return (
    <>
      {Array.from({ length: props.sections }).map((_, index: number) => {
        return (
          <m.div
            key={index}
            style={{ width: `${98 / props.sections}%` }}
            className={`h-2 rounded-full border-2 border-zinc-300 `}
          >
            <m.div
              style={{ width: getWidth(index, props.value) }}
              className={`h-full w-full ${props.color} rounded-full duration-300 ease-in-out`}
            ></m.div>
          </m.div>
        );
      })}
    </>
  );
};

export default StatusBar;
