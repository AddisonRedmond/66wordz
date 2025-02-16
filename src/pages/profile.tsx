import { NextPage } from "next/types";
import Header from "~/components/hearder";
import { api } from "~/utils/api";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "~/components/navbar/navbar";

const Profile: NextPage = () => {
  const user = api.getUser.getUser.useQuery();
  const cancelSubscription = api.upgrade.cancelSubscription.useMutation();

  const handleCancelSubscription = async () => {
    const cancelled = await cancelSubscription.mutateAsync();
    user.refetch();

    toast(
      cancelled?.successfullyCancelled
        ? "✅Successfully cancelled✅"
        : "Failed to cancel subscription",
    );
  };

  const getFullDate = (dateMiliseconds: number) => {
    const date = new Date(dateMiliseconds * 1000);
    return date.toDateString();
  };

  return (
    <>
      <Navbar key="navbar" />
      <div className="flex min-w-[375px] flex-grow flex-col items-center justify-evenly">
        <Toaster />
        <Header
          isLoading={false}
          desktopOnly={false}
        />
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
          <p>
            <span className="font-semibold">Name:</span> {user.data?.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.data?.email}
          </p>
          {user.data?.currentPeriodEnd && (
            <p>
              <span className="font-semibold">Next bill:</span>{" "}
              {getFullDate(user.data?.currentPeriodEnd)}
            </p>
          )}
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
    </>
  );
};

export default Profile;
