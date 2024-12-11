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
  return <Image width={width} height={height} unoptimized {...props} />;
};

export default CustomImage;
