const OpponentsContainer: React.FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  return (
    <div
      style={{ maxWidth: "33%" }}
      className="flex w-1/4 flex-grow flex-wrap items-center gap-1 justify-evenly px-2"
    >
      {children}
    </div>
  );
};

export default OpponentsContainer;
