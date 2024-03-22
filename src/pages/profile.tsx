import { NextPage } from "next/types";
import Header from "~/components/hearder";
import { api } from "~/utils/api";
import Image from "next/image";
import { AuthContext, authRequired } from "~/utils/authRequired";
import toast, { Toaster } from "react-hot-toast";

const Profile: NextPage = () => {
  const user = api.getUser.getUser.useQuery();
  const cancelSubscription = api.upgrade.cancelSubscription.useMutation();
  const test = api.upgrade.reactiveateSubscription.useMutation();

  const handleCancelSubscription = async () => {
    const cancelled = await cancelSubscription.mutateAsync();
    user.refetch();

    toast(
      cancelled?.successfullyCancelled
        ? "✅Successfully cancelled✅"
        : "Failed to cancel subscription",
    );
  };

  return (
    <div className="flex min-h-screen min-w-[375px] flex-col items-center justify-evenly">
      <Toaster />
      <Header isLoading={false} desktopOnly={true} />
      <div className="font-medium">
        {user.data?.image && (
          <Image
            src={user.data?.image}
            width={50}
            height={50}
            alt="profile image"
            className="mb-4 rounded-full"
          />
        )}
        <p>{user.data?.name}</p>
        <p>{user.data?.email}</p>
      </div>

      {!user.data?.cancelAtPeriodEnd &&
        user.data?.cancelAtPeriodEnd !== null &&
        user.isSuccess && (
          <button
            onClick={() => {
              handleCancelSubscription();
            }}
            className=" rounded-full border-4 border-red-600 p-2 font-semibold duration-150 ease-in-out hover:bg-red-600 hover:text-white"
          >
            Cancel Subscription
          </button>
        )}
    </div>
  );
};

export default Profile;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, false);
}
