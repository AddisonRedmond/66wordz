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
      className="absolute top-12 w-full overflow-hidden rounded-md border-2 bg-white"
    >
      {children}
    </m.div>
  );
};
export default ChallengeDropdown;
