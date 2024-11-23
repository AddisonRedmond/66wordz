const LifeTimer: React.FC<{ endTime?: number }> = ({ endTime }) => {
  return (
    <div className="block h-2">
      <div className="h-full w-1/4 rounded-full bg-emerald-300 duration-1000 ease-linear"></div>
    </div>
  );
};

export default LifeTimer;
