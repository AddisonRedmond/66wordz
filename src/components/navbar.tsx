import Image from "next/image";
import profile from "../../public/PersonCircle.svg";
import { signOut } from "next-auth/react";
const Navbar: React.FC = () => {
  return (
    <div className="absolute top-0 z-10 flex h-14 w-screen flex-row items-center justify-between px-8">
      <p className="cursor-pointer text-4xl font-semibold">66</p>
      <Image
        onClick={() => signOut()}
        className="cursor-pointer"
        height={40}
        src={profile}
        alt="profile icon"
      />
    </div>
  );
};

export default Navbar;
