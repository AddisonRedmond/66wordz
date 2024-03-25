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
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Loading />
        </m.div>
      ) : (
        <m.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex flex-col items-center gap-3 mt-20 mb-4"
        >
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
