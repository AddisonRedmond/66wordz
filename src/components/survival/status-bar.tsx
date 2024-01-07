import { motion } from "framer-motion";

type StatusBarProps = {
  statusValue?: number;
  color: string;
};
const StatusBar: React.FC<StatusBarProps> = (props: StatusBarProps) => {
  return (
    <motion.div
      animate={{ width: `${props.statusValue ? props.statusValue : 0}%` }}
      className={`h-2 w-full rounded-full ${props.color}`}
    ></motion.div>
  );
};

export default StatusBar;
