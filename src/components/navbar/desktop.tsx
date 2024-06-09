import signout from "../../../public/signout.svg";
import Image from "next/image";
import Link from "next/link";
import bell from "../../../public/bell.png";
type DesktopNavbarProps = {
  handleSignOut: () => void;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (
  props: DesktopNavbarProps,
) => {
  return (
    <div className="sticky top-0 hidden h-14 w-screen items-center justify-between px-8 sm:flex">
      <div className="cursor-pointer text-4xl font-semibold">
        <Link href="/">
          <p>66</p>
        </Link>
      </div>
      <div className="relative flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
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

        <button className="relative rounded-md p-2 font-semibold text-black duration-150 ease-in-out hover:bg-gray-500">
          <span className="absolute -top-[2px] right-1 flex">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
          <Image src={bell} alt="notification icon" height={25} />
        </button>
        <button
          onClick={() => props.handleSignOut()}
          className="rounded-md p-2 font-semibold text-black duration-150 ease-in-out hover:bg-gray-500"
        >
          <Image src={signout} alt="signout icon" height={25} />
        </button>
      </div>
    </div>
  );
};

export default DesktopNavbar;
