type LoadingPlayersProps = {
  totalPlayers: number;
};

const LoadingPlayers: React.FC<LoadingPlayersProps> = ({
  totalPlayers,
}: LoadingPlayersProps) => {
  return (
    <div className="mb-6 text-center font-semibold">
      <p className="text-2xl">LOADING PLAYERS</p>
      <p className="text-xl font-semibold">{totalPlayers} out of 66</p>
    </div>
  );
};

export default LoadingPlayers;
