import { useState } from "react";

import { api } from "~/utils/api";
import DesktopNavbar from "./desktop";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobileNavbar from "./mobile";
import getStripe from "~/utils/get-stripejs";
import { useClerk } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const {signOut} = useClerk()

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const isPremiumUser = api.getUser.isPremiumUser.useQuery();
  const isMobile = useIsMobile();

  const upgrade = api.upgrade.createCheckout.useMutation();

  const handleUpgrade = async () => {
    const checkoutURL = await upgrade.mutateAsync();
    const stripe = await getStripe();
    if (stripe !== null && checkoutURL) {
      await stripe.redirectToCheckout({ sessionId: checkoutURL });
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileNavbar
          handleUpgrade={handleUpgrade}
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
          handleSignOut={signOut}

        />
      ) : (
        <DesktopNavbar
          handleUpgrade={handleUpgrade}
          isPremiumUser={isPremiumUser.data?.isPremiumUser}
          handleSignOut={signOut}
        />
      )}
    </>
  );
};

export default Navbar;
