type GameInfoContainerProps = {
  children: JSX.Element;
};

const GameInfoContainer: React.FC<GameInfoContainerProps> = (props) => {
  return (
    <div className="mx-auto w-2/3 rounded-lg bg-gray-100 shadow-md">
      {props.children}
    </div>
  );
};

export default GameInfoContainer;
