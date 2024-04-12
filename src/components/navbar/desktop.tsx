import { AnimatePresence, m } from "framer-motion";
import { signOut } from "next-auth/react";
import signout from "../../../public/signout.svg";
import Image from "next/image";
import bell from "../../../public/bell.png";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import NotificationBadge from "../notifications/notification-badge";
type DesktopNavbarProps = {
  isPremiumUser: boolean | undefined;
  handleUpgrade: () => void;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (
  props: DesktopNavbarProps,
) => {
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const notifications = api.notifications.getNotifications.useQuery();

  return (
    <div className="sticky top-0 flex h-14 w-screen items-center justify-between px-8">
      <div className="cursor-pointer text-4xl font-semibold">
        <Link href="/">
          <p>66</p>
        </Link>
      </div>
      <div className="relative flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
        {!props.isPremiumUser && (
          <button
            onClick={() => props.handleUpgrade()}
            className="cursor-pointer rounded-md p-1 text-sm hover:bg-gray-500"
          >
            Upgrade
          </button>
        )}

        <Link href="/">
          <button className="rounded-md p-1 text-sm hover:bg-gray-500">
            Home
          </button>
        </Link>

        <Link href="/profile">
          <button className="rounded-md p-1 text-sm hover:bg-gray-500">
            Profile
          </button>
        </Link>

        <Link href="/friends">
          <button className=" relative rounded-md p-1 text-sm hover:bg-gray-500">
            Friends
          </button>
        </Link>

        {/* <button
          className="relative"
          onClick={() => {
            setNotificationIsOpen(!notificationIsOpen);
          }}
        >
          <Image src={bell} height={25} alt="notification icon" />
          <div className="absolute -right-3 -top-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
            </span>
          </div>
        </button> */}

        <button
          onClick={() => signOut()}
          className="rounded-md p-2 font-semibold text-black duration-150 ease-in-out hover:bg-gray-500"
        >
          <Image src={signout} alt="signout icon" height={25} />
        </button>
{/* 
        <AnimatePresence>
          {notificationIsOpen && (
            <m.div
              initial={{ height: 0 }}
              animate={{ height: "400px" }}
              exit={{ height: 0 }}
              className="absolute top-14 flex w-72 flex-col rounded-md border-2 border-black"
            >
              {notifications.data?.map((notification) => {
                return <NotificationBadge notification={notification} />;
              })}
            </m.div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
};

export default DesktopNavbar;
