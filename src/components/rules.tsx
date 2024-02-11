import { GameType } from "@prisma/client";

type RulesProps = {
  rules: string;
};

const Rules: React.FC<RulesProps> = (props: RulesProps, gameType: GameType) => {
  return <div></div>;
};

export default Rules;
