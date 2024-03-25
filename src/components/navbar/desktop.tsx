import { m } from "framer-motion";
import { signOut } from "next-auth/react";
import signout from "../../../public/signout.svg";
import Image from "next/image";
import { api } from "~/utils/api";
import getStripe from "~/utils/get-stripejs";
import Link from "next/link";
type DesktopNavbarProps = {
  issueModalIsOpen: (isOpen: boolean) => void;
  isPremiumUser: boolean | undefined;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = (
  props: DesktopNavbarProps,
) => {
  const upgrade = api.upgrade.createCheckout.useMutation();

  const handleUpgrade = async () => {
    const checkoutURL = await upgrade.mutateAsync();
    const stripe = await getStripe();
    console.log(checkoutURL);
    if (stripe !== null && checkoutURL) {
      await stripe.redirectToCheckout({ sessionId: checkoutURL });
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sticky top-0 flex h-14 w-screen items-center justify-between px-8"
    >
      <div className="cursor-pointer text-4xl font-semibold">
        <Link href="/">
          <p>66</p>
        </Link>
      </div>
      <div className="flex items-center justify-around gap-8 rounded-full bg-neutral-900 px-5 py-1 font-semibold text-white">
        {!props.isPremiumUser && (
          <button
            onClick={() => handleUpgrade()}
            className="cursor-pointer rounded-md p-1 text-sm hover:bg-gray-500"
          >
            Upgrade
          </button>
        )}

        <button className="cursor-pointer rounded-md p-1 text-sm hover:bg-gray-500">
          <Link href="/">Home</Link>
        </button>
        <button className="cursor-pointer rounded-md p-1 text-sm hover:bg-gray-500">
          <Link href="/profile">Profile</Link>
        </button>

        <button
          onClick={() => signOut()}
          className="font-semibol rounded-md p-2 text-black duration-150 ease-in-out hover:bg-gray-500"
        >
          <Image src={signout} alt="signout icon" height={25} />
        </button>
      </div>
    </m.div>
  );
};

export default DesktopNavbar;
