import Loading from "./loading";
import Tile from "./tile";
import { AnimatePresence, motion } from "framer-motion";

type HeaderProps = {
  isLoading: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLoading }: HeaderProps) => {
  return (
    <>
      {isLoading ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Loading />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <Tile letters={"66"} />
          <Tile letters="WORDZ" />
        </motion.div>
      )}
    </>
  );
};

export default Header;
