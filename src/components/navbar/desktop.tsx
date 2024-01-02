import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

type DesktopNavbarProps = {
  issueModalIsOpen: (isOpen: boolean) => void;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (
  props: DesktopNavbarProps,
) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute top-0 flex h-14 w-screen items-center justify-between px-8"
    >
      <div className="cursor-pointer text-4xl font-semibold">
        <p>66</p>
      </div>
      <div className="flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
        {/* <p className="cursor-pointer rounded-md p-1">Game Stats</p> */}
        <p onClick={()=>props.issueModalIsOpen(true)} className="cursor-pointer rounded-md p-1">Report Issue</p>

        <button
          onClick={() => signOut()}
          className="font-semibol rounded-md bg-white p-2 text-black duration-150 ease-in-out hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default DesktopNavbar;
