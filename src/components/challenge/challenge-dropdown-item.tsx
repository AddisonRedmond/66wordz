import Image from "next/image";
import { getInitials } from "~/utils/game";

type ChallengeDropdownItemProps = {
  image?: string | null;
  id: string;
  name: string;
  handleFriendToList: (friendId: string, friendName: string) => void;
  selected: boolean;
};

const ChallengeDropdownItem: React.FC<ChallengeDropdownItemProps> = (props) => {
  return (
    <div
      className={`flex h-20 w-full items-center justify-between border-b-2 border-white px-4 duration-150 ease-in-out ${props.selected ? "bg-zinc-200" : ""}`}
    >
      <div className="flex items-center gap-x-2">
        {props.image ? (
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={props.image}
            alt="Friend Image"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-500 font-medium text-white">
            <p>{getInitials(props.name)}</p>
          </div>
        )}
        <p>{props.name}</p>
      </div>
      {!props.selected && (
        <button
          onClick={() => {
            props.handleFriendToList(props.id, props.name);
          }}
          className="rounded-md border-2 bg-[#9462C6] p-2 font-semibold text-white"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default ChallengeDropdownItem;
