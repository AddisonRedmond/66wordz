type AutoAttackProps = {
  autoAttack: "first" | "last" | "random" | "off";
  setAutoAttack: (autoAttack: "first" | "last" | "random" | "off") => void;
};

const AutoAttack: React.FC<AutoAttackProps> = (props: AutoAttackProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center sm:my-3 sm:gap-1">
      <div className="sm:mb-2">
        <p className="text-xs font-semibold sm:text-base">Auto Attack</p>
      </div>
      <div>
        <button
          className={`mb-2 w-16 rounded-full border-2 border-gray-200 p-1 text-sm font-semibold duration-150 ease-in-out hover:bg-gray-200 ${
            props.autoAttack === "off" && " border-violet-500"
          }`}
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
          className={` w-20 rounded-full border-2 border-gray-200 py-2  text-xs duration-150 ease-in-out hover:bg-gray-200 sm:w-28 sm:text-base ${
            props.autoAttack === "first" && " border-violet-500"
          }`}
        >
          First Place
        </button>
        <button
          onClick={() => {
            props.setAutoAttack("last");
          }}
          className={` w-20 rounded-full border-2 border-gray-200 py-2  text-xs duration-150 ease-in-out hover:bg-gray-200 sm:w-28 sm:text-base ${
            props.autoAttack === "last" && " border-violet-500"
          }`}
        >
          Last Place
        </button>
        <button
          onClick={() => {
            props.setAutoAttack("random");
          }}
          className={` w-20 rounded-full border-2 border-gray-200 py-2  text-xs duration-150 ease-in-out hover:bg-gray-200 sm:w-28 sm:text-base ${
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
