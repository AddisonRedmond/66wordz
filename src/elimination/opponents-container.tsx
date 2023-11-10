import Opponent from "./opponent";
type Player = {
  playerId: string;
  playerData:
    | {
        guessCount: number;
        matchingIndex?: number[] | undefined;
      }
    | undefined;
  points: number | undefined;
};

type OpponentsContainerProps = {
  players?: Player[];
  word: string;
};

const OpponentsContainer: React.FC<OpponentsContainerProps> = (
  props: OpponentsContainerProps,
) => {
  if (props.players) {
    return (
      <div className="flex w-1/3 flex-wrap justify-around gap-x-1 gap-y-2 overflow-hidden">
        {props.players.map((player: Player) => {
          return (
            <Opponent
              key={player.playerId}
              numOfOpponents={props?.players?.length}
              points={player?.points}
              matchingIndex={player.playerData?.matchingIndex}
              wordLength={props.word.length}
            />
          );
        })}
      </div>
    );
  }
};

export default OpponentsContainer;
