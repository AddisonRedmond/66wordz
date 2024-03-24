import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import burger from "../../../public/burger.svg";
import signout from "../../../public/signout.svg";
import close from "../../../public/white_circle_x.svg";
import { signOut } from "next-auth/react";

type MobileNavbarProps = {
  menuIsOpen: boolean;
  setMenuIsOpen: (isOpen: boolean) => void;
};
const MobielNavbar: React.FC<MobileNavbarProps> = (
  props: MobileNavbarProps,
) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute ${
        props.menuIsOpen && "z-10"
      } top-0 flex h-14 w-screen items-center justify-between bg-white`}
    >
      <AnimatePresence>
        {props.menuIsOpen && (
          <m.div
            transition={{ duration: 0.3, type: "just" }}
            initial={{ opacity: 1, y: "-10vh" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: "-10vh" }}
            className="absolute top-0 h-[10vh] w-screen justify-center bg-black text-white"
          >
            <div className="flex h-14 w-full flex-row items-center justify-end gap-8 pr-8">
              <Image
                onClick={() => signOut()}
                height={35}
                src={signout}
                alt="signout icon"
              />
              <Image
                onClick={() => props.setMenuIsOpen(false)}
                height={35}
                src={close}
                alt="close icon"
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <div className="flex w-screen justify-between px-8">
        <div className="cursor-pointer text-4xl font-semibold text-white">
          <p className="mix-blend-difference">66</p>
        </div>
        <div className="flex items-center">
          <Image
            height={25}
            onClick={() => props.setMenuIsOpen(true)}
            src={burger}
            alt="burger menu icon"
          />
        </div>
      </div>
    </m.div>
  );
};

export default MobielNavbar;
