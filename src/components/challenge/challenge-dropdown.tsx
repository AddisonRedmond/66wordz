import { m } from "framer-motion";
import { RefObject } from "react";

type ChallengeDropdownProps = {
  children: JSX.Element | JSX.Element[];
  dropdownRef: RefObject<HTMLDivElement>;
};

const ChallengeDropdown: React.FC<ChallengeDropdownProps> = ({
  children,
  ...props
}) => {
  return (
    <m.div
      ref={props.dropdownRef}
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      className="absolute top-12 w-[95%] overflow-hidden rounded-md border-2 bg-zinc-200"
    >
      {children}
    </m.div>
  );
};
export default ChallengeDropdown;
