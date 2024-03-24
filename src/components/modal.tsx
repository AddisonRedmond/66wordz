import { AnimatePresence, m } from "framer-motion";

type Modal = {
  children: JSX.Element | JSX.Element[];
};

const Modal: React.FC<Modal> = (
  props: Modal,
) => {
  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
      >
        <m.dialog
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          open={true}
          className="relative z-50 m-auto  rounded-md py-2"
        >
          {props.children}
        </m.dialog>
      </m.div>
    </AnimatePresence>
  );
};

export default Modal;