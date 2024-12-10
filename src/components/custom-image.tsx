import Image from "next/image";

type CustomImageProps = {
  onClick?: () => void;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const CustomImage: React.FC<CustomImageProps> = ({
  width = 30,
  height = 30,
  ...props
}) => {
  return (
    <span className="size-7">
      <Image width={width} height={height} unoptimized {...props} />
    </span>
  );
};

export default CustomImage;
