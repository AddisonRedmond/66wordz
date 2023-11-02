import Opponent from "./opponent";
type Player = {
  playerId: string;
  points: number;
  playerData: { guessCount: number; matchingIndex: number[] };
};
type OpponentsContainerProps = {
  players: Player[];
  word: string;
};

const OpponentsContainer: React.FC<OpponentsContainerProps> = (
  props: OpponentsContainerProps,
) => {
  return (
    <div className="flex w-1/3 flex-wrap justify-around gap-x-1 gap-y-2 overflow-hidden">
      {props.players.map((player: Player, index: number) => {
        return (
          <Opponent
            key={player.playerId}
            numOfOpponents={props.players.length}
            points={player?.points}
            matchingIndex={player.playerData?.matchingIndex}
            wordLength={props.word.length}
          />
        );
      })}
      {/* {Array.from({ length: 33 }).map((_, index: number) => {
        return (
          <Opponent
            key={props.players.playerId}
            numOfOpponents={33}
            points={200}
            matchingIndex={[1, 3]}
            wordLength={5}
          />
        );
      })} */}
    </div>
  );
};

export default OpponentsContainer;
