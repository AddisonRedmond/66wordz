import { AnimatePresence, m } from "framer-motion";
import { RefObject } from "react";
type Modal = {
  children: JSX.Element | JSX.Element[];
  isOpen: boolean;
  reference?: RefObject<HTMLDivElement>;
};
const AnimatedModal: React.FC<Modal> = (props) => {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            ref={props.reference}
            className="grid place-content-center"
          >
            {props.children}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
