import { signIn } from "next-auth/react";
import { AuthContext, authRequired } from "~/utils/authRequired";

const TermsOfService = () => {
  return (
    <div className="flex-grow">
      <div className="w-screen flex items-center justify-between p-4">
        <p className="cursor-pointer text-4xl font-semibold">66</p>
        <button
          onClick={() => signIn()}
          className=" rounded-md bg-black p-2 text-2xl text-white duration-150 ease-in-out hover:bg-zinc-700"
        >
          SIGN IN
        </button>
      </div>
      <main className="mx-auto flex flex-col flex-grow max-w-[1000px]">
        <h1>Terms and Conditions</h1>
      </main>
    </div>
  );
};

export default TermsOfService;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, true);
}
