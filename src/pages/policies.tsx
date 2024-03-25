import { NextPage } from "next";

const Collapse = () => {
  return (
    <div className="rounded-md border-4 border-black w-96 h-14">
      <p>Privacy</p>
    </div>
  );
};

const Policies: NextPage = () => {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-3">
      <div>
        <h1 className="text-4xl font-bold">Policies</h1>
        <p>
          Read our policies to understand the terms and conditions of using our
          platform.
        </p>
      </div>
      <div>
        <Collapse />
      </div>
    </div>
  );
};

export default Policies;
