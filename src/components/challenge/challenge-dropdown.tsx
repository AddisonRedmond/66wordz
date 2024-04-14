import { m } from "framer-motion";

type ChallengeDropdownProps = {
  children: JSX.Element | JSX.Element[];
};

const ChallengeDropdown: React.FC<ChallengeDropdownProps> = (props) => {
  return (
    <m.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      className="absolute top-10 w-11/12 rounded-md border-2 bg-white overflow-hidden"
    >
      {props.children}
    </m.div>
  );
};
export default ChallengeDropdown;
