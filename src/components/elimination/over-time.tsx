import { AnimatePresence, m } from "framer-motion";

const OverTime: React.FC<{ isOvertime: boolean }> = (props) => {
  return (
    <AnimatePresence>
      {props.isOvertime && (
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="w-full text-center"
        >
          <p className="text-xl font-semibold">Overtime!</p>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default OverTime;
