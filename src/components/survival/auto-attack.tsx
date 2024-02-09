type AutoAttackProps = {
  autoAttack: "first" | "last" | "random" | "off";
  setAutoAttack: (autoAttack: "first" | "last" | "random" | "off") => void;
};

const AutoAttack: React.FC<AutoAttackProps> = (props: AutoAttackProps) => {
  return (
    <div className="flex flex-col gap-1 text-center">
      <div className="mb-2">
        <p className=" font-semibold">Auto Attack</p>
      </div>
      <div>
        <button
          className="w-16 rounded-full border-2 border-gray-200 p-1 text-sm font-semibold duration-150 ease-in-out hover:bg-gray-200"
          onClick={() => {
            props.setAutoAttack("off");
          }}
        >
          Off
        </button>
      </div>
      <div className="flex gap-2 text-sm font-semibold">
        <button
          onClick={() => {
            props.setAutoAttack("first");
          }}
          className={`w-28 rounded-full border-2 border-gray-200 py-2 duration-150 ease-in-out hover:bg-gray-200 ${
            props.autoAttack === "first" && " border-violet-500"
          }`}
        >
          First Place
        </button>
        <button
          onClick={() => {
            props.setAutoAttack("last");
          }}
          className={`w-28 rounded-full border-2 border-gray-200 py-2 duration-150 ease-in-out hover:bg-gray-200 ${
            props.autoAttack === "last" && " border-violet-500"
          }`}
        >
          Last Place
        </button>
        <button
          onClick={() => {
            props.setAutoAttack("random");
          }}
          className={`w-28 rounded-full border-2 border-gray-200 py-2 duration-150 ease-in-out hover:bg-gray-200 ${
            props.autoAttack === "random" && " border-violet-500"
          }`}
        >
          Random
        </button>
      </div>
    </div>
  );
};
export default AutoAttack;
