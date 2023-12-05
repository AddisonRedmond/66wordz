import { AnimatePresence, motion } from "framer-motion";

type EliminationModal = {
  children: JSX.Element | JSX.Element[];
};

const EliminationModal: React.FC<EliminationModal> = (
  props: EliminationModal,
) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
      >
        <motion.dialog
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          open={true}
          className="relative z-50 m-auto h-1/3 w-1/4 rounded-md py-2"
        >
          {props.children}
        </motion.dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default EliminationModal;
