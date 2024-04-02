import { useState } from "react";

import { api } from "~/utils/api";
import DesktopNavbar from "./desktop";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobileNavbar from "./mobile";
import getStripe from "~/utils/get-stripejs";

const Navbar: React.FC = () => {
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
        />
      ) : (
        <DesktopNavbar
          handleUpgrade={handleUpgrade}
          isPremiumUser={isPremiumUser.data?.isPremiumUser}
        />
      )}
    </>
  );
};

export default Navbar;
