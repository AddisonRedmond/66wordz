import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

const Collapse = () => {
  return (
    <div className="h-14 w-96 rounded-md border-4 border-black">
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
