import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useSignOutAccount } from "@/hooks/react-query/mutations";
import { useGetCurrentUser } from "@/hooks/react-query/queries";
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
          <img src="/images/logo.svg" alt="logo" width={130} height={325} />
        </Link>
        <div className="flex items-center gap-4">
          <Alert
            title="آیا مطمئن هستید ؟"
            onConfirm={signOutHandler}
            isLoading={isPending}
          >
            <Button variant="ghost" className="shad-button_ghost">
              <img src="/icons/logout.svg" alt="logout" />
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
