import signout from "../../../public/signout.svg";
import Image from "next/image";
import Link from "next/link";
type DesktopNavbarProps = {
  handleSignOut: () => void;
  hasFriendRequest: boolean;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (props) => {
  return (
    <div className="sticky top-0 hidden h-14 w-screen items-center justify-between px-8 sm:flex">
      <div className="cursor-pointer text-4xl font-semibold">
        <Link href="/">
          <p>66</p>
        </Link>
      </div>
      <div className="relative flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
        <Link href="/">
          <button className="rounded-md p-1 text-sm duration-150 ease-in-out hover:bg-gray-500">
            Home
          </button>
        </Link>

        <Link href="/profile">
          <button className="rounded-md p-1 text-sm duration-150 ease-in-out hover:bg-gray-500">
            Profile
          </button>
        </Link>

        <Link href="/friends">
          <div className="relative">
            <button className="rounded-md p-1 text-sm duration-150 ease-in-out hover:bg-gray-500">
              Friends
            </button>
            {props.hasFriendRequest && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-custom-accent opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-custom-accent"></span>
              </span>
            )}
          </div>
        </Link>

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
