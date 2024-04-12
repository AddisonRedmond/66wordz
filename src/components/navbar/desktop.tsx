import { m } from "framer-motion";
import { signOut } from "next-auth/react";
import signout from "../../../public/signout.svg";
import Image from "next/image";

import Link from "next/link";
type DesktopNavbarProps = {
  isPremiumUser: boolean | undefined;
  handleUpgrade: () => void;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (
  props: DesktopNavbarProps,
) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sticky top-0 flex h-14 w-screen items-center justify-between px-8"
    >
      <div className="cursor-pointer text-4xl font-semibold">
        <Link href="/">
          <p>66</p>
        </Link>
      </div>
      <div className="flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
        {!props.isPremiumUser && (
          <button
            onClick={() => props.handleUpgrade()}
            className="cursor-pointer rounded-md p-1 text-sm hover:bg-gray-500"
          >
            Upgrade
          </button>
        )}

        <button className="rounded-md p-1 text-sm hover:bg-gray-500">
          <Link href="/">Home</Link>
        </button>
        <button className="rounded-md p-1 text-sm hover:bg-gray-500">
          <Link href="/profile">Profile</Link>
        </button>
        <button className=" relative rounded-md p-1 text-sm hover:bg-gray-500">
          <Link href="/friends">
            Friends
          </Link>
          {/* <div className="absolute right-0 -top-1">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
            </span>
          </div> */}
        </button>

        <button
          onClick={() => signOut()}
          className="rounded-md p-2 font-semibold text-black duration-150 ease-in-out hover:bg-gray-500"
        >
          <Image src={signout} alt="signout icon" height={25} />
        </button>
      </div>
    </m.div>
  );
};

export default DesktopNavbar;
