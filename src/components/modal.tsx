import { AnimatePresence, m } from "framer-motion";

type Modal = {
  children: JSX.Element | JSX.Element[];
};

const Modal: React.FC<Modal> = (props: Modal) => {
  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
      >
        <m.dialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          open={true}
          className="relative z-50 m-auto  max-h-[90vh] overflow-auto rounded-md py-2"
        >
          {props.children}
        </m.dialog>
      </m.div>
    </AnimatePresence>
  );
};

export default Modal;
