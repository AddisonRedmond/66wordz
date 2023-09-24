import Image from "next/image";
import profile from "../../public/PersonCircle.svg";
const Navbar: React.FC = () => {
  return (
    <div className="flex h-14 w-screen flex-row items-center justify-between bg-black px-8 absolute top-0">
      <p className="cursor-pointer text-4xl font-semibold text-white">66</p>
      <Image
        className="cursor-pointer"
        height={40}
        src={profile}
        alt="profile icon"
      />
    </div>
  );
};

export default Navbar;
1;
