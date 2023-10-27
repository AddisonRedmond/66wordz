import Image from "next/image";
import profile from "../../public/PersonCircle.svg";
import { signOut } from "next-auth/react";
import { MouseEventHandler } from "react";
const Navbar: React.FC = () => {
  const handleSignOut: MouseEventHandler = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="absolute top-0 z-10 flex h-14 w-screen flex-row items-center justify-between px-8">
      <p className="cursor-pointer text-4xl font-semibold">66</p>
      <Image
        onClick={handleSignOut}
        className="cursor-pointer"
        height={40}
        src={profile}
        alt="profile icon"
      />
    </div>
  );
};

export default Navbar;
