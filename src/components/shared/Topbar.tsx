import { Link, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/hooks/react-query/mutations";
import Spinner from "../loaders/Spinner";
const Alert = lazy(() => import("@/components/shared/Alert"));

const Topbar = () => {
  const { mutate: signOutHandler, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
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
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Suspense fallback={<Spinner />}>
            <Alert title="آیا مطمئن هستید ؟" onSubmit={signOutHandler}>
              <Button variant="ghost" className="shad-button_ghost mt-4">
                <img src="/assets/icons/logout.svg" alt="logout" />
                <p className="small-medium lg:base-medium">
                  خروج از حساب کاربری
                </p>
              </Button>
            </Alert>
          </Suspense>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOutHandler()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
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
