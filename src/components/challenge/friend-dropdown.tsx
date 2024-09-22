import { m } from "framer-motion";
import { RefObject } from "react";

type FriendDropdownProps = {
  children: JSX.Element | JSX.Element[];
  dropdownRef: RefObject<HTMLDivElement>;
};

const FriendDropdown: React.FC<FriendDropdownProps> = ({
  children,
  ...props
}) => {
  return (
    <m.div
      ref={props.dropdownRef}
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      className="absolute top-12 z-10 w-[95%] overflow-auto rounded-md border-2 bg-zinc-200"
    >
      {children}
    </m.div>
  );
};
export default FriendDropdown;
