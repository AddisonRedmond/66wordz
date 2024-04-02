import Loading from "./loading";
import Tile from "./tile";
import { m } from "framer-motion";
import Sparkle from "react-sparkle";
type HeaderProps = {
  isLoading: boolean;
  desktopOnly?: boolean;
  isPremiumUser?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  isLoading,
  desktopOnly,
  ...props
}: HeaderProps) => {
  console.log;
  if (props.isPremiumUser) {
    return (
      <>
        {!desktopOnly && <m.div className="relative mb-4 flex h-1/5 flex-col justify-center items-center gap-3">
        <Sparkle
          color={"#D4B40E"}
          count={5}
          minSize={5}
          maxSize={15}
          overflowPx={10}
          fadeOutSpeed={20}
          newSparkleOnFadeOut={true}
          flicker={false}
          flickerSpeed={"slowest"}
        />
        <Tile
          bg={"bg-[#F1D024]"}
          textColor="text-zinc-800"
          letters={"66"}
          desktopOnly={desktopOnly}
        />
        <Tile
          bg={"bg-[#F1D024]"}
          textColor="text-zinc-800"
          letters="WORDZ"
          desktopOnly={desktopOnly}
        />

        <div className="animate-bounce rounded-full bg-black px-2 text-xl font-semibold text-white">
          <p className="">GOLD</p>
        </div>
      </m.div>}
      </>
    
    );
  }
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
        <m.div className="mb-4 flex h-1/5 flex-col justify-center items-center gap-3">
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
