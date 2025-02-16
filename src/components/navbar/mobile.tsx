import { m, AnimatePresence } from "framer-motion";
// import upgrade from "../../../public/upgrade.png";

import Link from "next/link";
import CustomImage from "../custom-image";
type MobileNavbarProps = {
  menuIsOpen: boolean;
  setMenuIsOpen: (isOpen: boolean) => void;
  handleUpgrade: () => void;
  handleSignOut: () => void;
  hasFriendRequest: boolean;
};
const MobileNavbar: React.FC<MobileNavbarProps> = (
  props: MobileNavbarProps,
) => {
  const burger =
    "https://utfs.io/f/e8LGKadgGfdISHzA1tBL1A7qyKpf45WPivbGZs2ItcuQgrmR";

  const profile =
    "https://utfs.io/f/e8LGKadgGfdIdNWSxeXyLxKtzJOHPXcMlIN97ehp0vEqn61s";

  const friends =
    "https://utfs.io/f/e8LGKadgGfdIlxHXFNV2VobYUl65uwdNGWpM7ImPkzsXFtga";

  const signout =
    "https://utfs.io/f/e8LGKadgGfdI49znZzmTRywNkmWY9Z3USKtaOiejHrsl8xv1";

  const home =
    "https://utfs.io/f/e8LGKadgGfdIIMEQuXiWjqcbmODSYeAwFzRl0iydf8KV4Zou";
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
            transition={{ duration: 0.2, type: "just" }}
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
                  <CustomImage
                    height={28}
                    width={28}
                    src={home}
                    alt="home icon"
                  />
                </div>
              </Link>
              <Link href="/profile">
                <div
                  onClick={() => props.setMenuIsOpen(false)}
                  className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
                >
                  <p>Profile</p>
                  <CustomImage
                    height={28}
                    width={28}
                    src={profile}
                    alt="profile icon"
                  />
                </div>
              </Link>
              <Link href="/friends">
                <div className="relative">
                  {props.hasFriendRequest && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-custom-accent opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-custom-accent"></span>
                    </span>
                  )}
                </div>
                <div
                  onClick={() => props.setMenuIsOpen(false)}
                  className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
                >
                  <p>Friends</p>
                  <CustomImage width={40} src={friends} alt="friends icon" />
                </div>
              </Link>
              {/* <div
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
              </div> */}
              <div
                onClick={() => props.handleSignOut()}
                className="flex justify-between rounded-md bg-neutral-700 px-2 py-1"
              >
                <p>Log out</p>
                <CustomImage
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
          <div className="relative">
            {props.hasFriendRequest && !props.menuIsOpen && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-custom-accent opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-custom-accent"></span>
              </span>
            )}
          </div>

          <CustomImage
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
