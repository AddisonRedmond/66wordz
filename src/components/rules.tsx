import { GameType } from "@prisma/client";

type RulesProps = {
  rules: {[header: string]: string[]};
  gameType: GameType;
  closeDescription: () => void;
};

const Rules: React.FC<RulesProps> = (props: RulesProps) => {
  return (
    <div className="px-3">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{`Rules for ${props.gameType}`}</h1>
        <button
          className="cursor-pointer text-xl"
          onClick={() => {
            props.closeDescription();
          }}
        >
          ✖
        </button>
      </div>

      {Object.keys(props.rules).map((header: string, index: number) => {
        return (
          <div className="my-2" key={index}>
            <h2 className="text-xl font-semibold">{header}</h2>
            <ul className="list-inside list-disc">
              {props.rules[header]?.map((rule: string, index: number) => {
                return <li key={index}>{rule}</li>;
              })}
            </ul>
          </div>
        );
      })}
     
    </div>
  );
};

export default Rules;
