import Image from "next/image";
import danger from "../../../public/danger.svg";

type EliminatedProps = {
  exitMatch: () => void;
};

const Eliminated: React.FC<EliminatedProps> = (props: EliminatedProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <Image src={danger} width={50} alt="warn" />
      <p className="text-xl font-bold">You have been eliminated</p>
      <p>Better luck next time!</p>
      <button
        onClick={() => props.exitMatch()}
        className=" rounded-md bg-zinc-800 p-2 font-semibold text-white hover:bg-zinc-700 transition duration"
      >
        Exit Match
      </button>
    </div>
  );
};

export default Eliminated;
