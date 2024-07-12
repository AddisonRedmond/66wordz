import Loading from "./loading";
import Tile from "./tile";
import { m } from "framer-motion";
type HeaderProps = {
  isLoading: boolean;
  desktopOnly?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  isLoading,
  desktopOnly,
}: HeaderProps) => {
  return (
    <>
      {isLoading ? (
        <m.div
          className="h-1/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loading />
        </m.div>
      ) : (
        <m.div className=" my-4 hidden h-1/5 flex-col items-center justify-center gap-3 sm:flex">
          <Tile letters={"66"} desktopOnly={desktopOnly} />
          <Tile letters="WORDZ" desktopOnly={desktopOnly} />

          <div className="animate-bounce rounded-full bg-black px-2 text-xl font-semibold text-white">
            <p className="">Beta</p>
          </div>
        </m.div>
      )}
    </>
  );
};

export default Header;
