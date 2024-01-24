import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LogOutIcon from "/icons/logout.svg";
import FullLogoIcon from "/images/logo.svg";
import { useSignOutAccount } from "@/hooks/tanstack-query/mutations/auth-hooks";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { Button } from "@/components/ui/button";
import Alert from "./Alert";

const Topbar = () => {
  const {
    mutateAsync: signOutHandler,
    isSuccess,
    isPending,
  } = useSignOutAccount();
  const { data: user } = useGetCurrentUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src={FullLogoIcon} alt="logo" width={130} height={325} />
        </Link>
        <div className="flex items-center gap-4">
          <Alert
            title="آیا مطمئن هستید ؟"
            onConfirm={signOutHandler}
            isLoading={isPending}
          >
            <Button variant="ghost" className="shad-button_ghost">
              <img src={LogOutIcon} alt="logout" />
            </Button>
          </Alert>
          <Link
            to={`/profile/${user?.$id}`}
            className="flex-center shrink-0 gap-3"
          >
            <img
              src={user?.imageUrl || "/icons/profile-placeholder.svg"}
              alt="profile image"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
