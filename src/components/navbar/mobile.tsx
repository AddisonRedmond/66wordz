import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import burger from "../../../public/burger.svg";
import profile from "../../../public/profile.png";
import signout from "../../../public/signout.svg";
import home from "../../../public/home.png";
import upgrade from "../../../public/upgrade.png";

import { signOut } from "next-auth/react";

import Link from "next/link";
type MobileNavbarProps = {
  menuIsOpen: boolean;
  setMenuIsOpen: (isOpen: boolean) => void;
  handleUpgrade: () => void;
};
const MobileNavbar: React.FC<MobileNavbarProps> = (
  props: MobileNavbarProps,
) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sticky top-0 z-20 flex h-14 w-screen items-center justify-between bg-white"
    >
      <AnimatePresence>
        {props.menuIsOpen && (
          <m.div
            transition={{ duration: 0.25, type: "just" }}
            initial={{ opacity: 1, y: "-100vh" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: "-100vh" }}
            className="absolute top-0 h-[90vh] w-screen justify-center bg-neutral-900 text-white"
          >
            <div className="flex h-14 w-full flex-row items-center justify-end pr-8">
              <button
                onClick={() => props.setMenuIsOpen(false)}
                className="h-10 rounded-md bg-white p-2 font-semibold text-black"
              >
                Close
              </button>
            </div>

            <div className="mt-6 flex w-screen flex-col gap-4 px-4 text-xl font-semibold">
              <Link href="/">
                <div
                  onClick={() => props.setMenuIsOpen(false)}
                  className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
                >
                  <p>Home</p>
                  <Image height={28} width={28} src={home} alt="bug icon" />
                </div>
              </Link>
              <Link href="/profile">
                <div
                  onClick={() => props.setMenuIsOpen(false)}
                  className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
                >
                  <p>Profile</p>
                  <Image height={28} width={28} src={profile} alt="bug icon" />
                </div>
              </Link>

              <div
                onClick={() => props.handleUpgrade()}
                className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
              >
                <p>Upgrade</p>
                <Image
                  height={28}
                  width={28}
                  src={upgrade}
                  alt="upgrade icon"
                />
              </div>
              <div
                onClick={() => signOut()}
                className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
              >
                <p>Log out</p>
                <Image
                  height={28}
                  width={28}
                  src={signout}
                  alt="signout icon"
                />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <div className="flex w-screen justify-between px-8">
        <div className="cursor-pointer text-4xl font-semibold text-white">
          <p className="mix-blend-difference">
            <Link href="/">66</Link>
          </p>
        </div>
        <div>
          <Image
            onClick={() => props.setMenuIsOpen(true)}
            src={burger}
            alt="burger menu icon"
          />
        </div>
      </div>
    </m.div>
  );
};

export default MobileNavbar;
