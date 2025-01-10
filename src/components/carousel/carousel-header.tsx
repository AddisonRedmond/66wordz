import CustomImage from "../custom-image";

type CarouselHeaderProps = {
  header: string;
  closeFunc: () => void;
};

const CarouselHeader: React.FC<CarouselHeaderProps> = ({
  header,
  closeFunc,
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <h2 className="text-xl font-semibold">{header}</h2>
      <button
        className="absolute right-4 grid size-8 place-content-center rounded-full p-2 duration-150 ease-in-out hover:bg-zinc-200"
        onClick={() => closeFunc()}
      >
        <CustomImage
          alt="close image"
          src="https://utfs.io/f/e8LGKadgGfdIfDAEbucOc83n9dYWFpwgIotC1RUxDMJmAlsh"
        />
      </button>
    </div>
  );
};

export default CarouselHeader;
