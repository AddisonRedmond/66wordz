import { AnimatePresence, motion } from "framer-motion";

type OpponentModalProps = {
  children: JSX.Element | JSX.Element[];
  isOpen: boolean;
};

const OpponentModal: React.FC<OpponentModalProps> = (
  props: OpponentModalProps,
) => {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-gray-400 bg-opacity-50"
        >
          <motion.dialog
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            open={true}
            className="relative z-50 m-auto  rounded-md py-2"
          >
            {props.children}
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpponentModal;
