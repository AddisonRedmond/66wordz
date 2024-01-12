import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
type StatusBarProps = {
  statusValue?: number;
  color: string;
};
const StatusBar: React.FC<StatusBarProps> = (props: StatusBarProps) => {
  const [scope, animate] = useAnimate();
  const [scopeRed, animateRed] = useAnimate();

  useEffect(() => {
    if (scope && scopeRed) {
      animate(scope.current, {
        width: `${props.statusValue ? props.statusValue -.5 : 0}%`,
      }).then(() => {
        animate(scopeRed.current, {
          width: `${props.statusValue ? props.statusValue -.5 : 0}%`,
        })
      });
    }
  }, [props.statusValue]);
  return (
    <>
      <motion.div
        ref={scopeRed}
        // animate={{
        //   width: `${props.statusValue ? props.statusValue : 0}%`,
        // }}
        className={`absolute h-2 rounded-full bg-red-600`}
      ></motion.div>
      <motion.div
        ref={scope}
        // animate={{ width: `${props.statusValue ? props.statusValue : 0}%` }}
        className={`absolute h-2 rounded-full ${props.color}`}
      ></motion.div>
    </>
  );
};

export default StatusBar;
