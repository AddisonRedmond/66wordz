import { motion } from "framer-motion";

type ModalProps = {
  placement?: number;
  totalTime?: string;
  totalGuesses?: number;
  exitMatch: () => void;
};

const Modal: React.FC<ModalProps> = ({
  placement,
  totalTime,
  totalGuesses,
  exitMatch,
}: ModalProps) => {
  return (
    <motion.dialog
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      open={true}
      className="absolute top-1/3 z-20 m-auto h-1/3 w-1/5 rounded-md bg-black text-white"
    >
      <div className="flex h-full flex-col justify-around">
        <div className="mb-6 text-center text-xl font-semibold">
          <p>{placement === 1 ? "WINNER!" : "Eliminated"}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <p>{`#${placement}`}</p>
          </div>
          <div className="flex justify-center">
            <p>{`Total time - ${totalTime}`}</p>
          </div>
          {/* <div className="flex justify-center">
              <p>Correct Guesses - 14</p>
            </div> */}
          <div className="flex justify-center">
            <p>{`Total Guesses - ${totalGuesses}`}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => exitMatch()}
            className="ml-2 rounded-md bg-[#9462C6] p-2 font-semibold text-black duration-150 ease-in-out hover:bg-[#c39ce9]"
          >
            Exit Match
          </button>
        </div>
      </div>
    </motion.dialog>
  );
};

export default Modal;
