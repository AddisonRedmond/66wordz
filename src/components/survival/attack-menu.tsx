import { AttackPosition } from "./survival";

const AttackButton: React.FC<{
  text: string;
  totalButtons: number;
  attackPosition: AttackPosition;
  setAttackPosition: (id: string) => void;
  setRandomPosition: () => void;

  //   handleClick: () => void;
}> = (props) => {
  const isSelected = props.text === props.attackPosition;

  return (
    <button
      onClick={() => {
        if (props.text === "Random") {
          props.setRandomPosition();
        } else {
          props.setAttackPosition(props.text);
        }
      }}
      style={{ width: `${Math.floor(100 / props.totalButtons)}%` }}
      className={`max-w-36 rounded-full border-2 border-zinc-500 py-1 font-semibold duration-150 ease-linear ${isSelected ? "bg-zinc-900 text-white" : "hover:bg-zinc-300"}`}
    >
      {props.text}
    </button>
  );
};

const AttackMenu: React.FC<{
  attackPosition: AttackPosition;
  setAttackPosition: (id: string) => void;
  handleSetRandom: () => void;
}> = (props) => {
  const buttons = ["First", "Random", "Last"];
  return (
    <div className="flex w-full justify-between">
      {buttons.map((button) => {
        return (
          <AttackButton
            key={button}
            totalButtons={buttons.length}
            text={button}
            attackPosition={props.attackPosition}
            setAttackPosition={props.setAttackPosition}
            setRandomPosition={props.handleSetRandom}
          />
        );
      })}
    </div>
  );
};

export default AttackMenu;
