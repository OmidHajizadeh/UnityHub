import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import LogOutIcon from "/icons/logout.svg";
import { useSignOutAccount } from "@/hooks/tanstack-query/mutations/auth-hooks";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { Button } from "@/components/ui/button";
import Alert from "./Alert";

const sidebarLinks = [
  {
    imageUrl: "/icons/home.svg",
    route: "/",
    label: "خانه",
  },
  {
    imageUrl: "/icons/wallpaper.svg",
    route: "/explore",
    label: "اکسپلورر",
  },
  {
    imageUrl: "/icons/notification.svg",
    route: "/audits",
    label: "گزارش ها",
  },
  {
    imageUrl: "/icons/people.svg",
    route: "/all-users",
    label: "کاربران",
  },
  {
    imageUrl: "/icons/add-post.svg",
    route: "/create-post",
    label: "پست جدید",
  },
];

const MainSidebar = () => {
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
  }, [isSuccess, navigate]);

  return (
    <nav className="rightsidebar">
      <div className="flex flex-col gap-11">
        {user ? (
          <Link to={`/profile/${user.$id}`} className="flex gap-3 items-center">
            <img
              src={user?.imageUrl || "/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">{user.username}@</p>
            </div>
          </Link>
        ) : (
          <div className="flex gap-3 items-center">
            <div className="bg-slate-400 rounded-full h-14 w-14 animate-pulse" />
            <div className="flex flex-col grow gap-2">
              <div className="h-6 rounded-sm animate-pulse w-full max-w-[9rem] bg-white" />
              <div className="h-4 rounded-sm animate-pulse w-full max-w-[6rem] bg-light-3" />
            </div>
          </div>
        )}
        <ul className="flex flex-col gap-4">
          {sidebarLinks.map((link, index) => (
            <li key={index} className="rightsidebar-link group">
              <NavLink
                to={link.route}
                className="sidebarlink group flex gap-4 px-4 py-3 items-center"
              >
                <img
                  src={link.imageUrl}
                  alt="icon"
                  className="group-hover:invert-white transition"
                />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Alert
        title="آیا مطمئن هستید ؟"
        onConfirm={signOutHandler}
        isLoading={isPending}
      >
        <Button variant="ghost" className="shad-button_ghost mt-4">
          <img src={LogOutIcon} alt="logout" />
          <p className="small-medium lg:base-medium">خروج از حساب کاربری</p>
        </Button>
      </Alert>
    </nav>
  );
};

export default MainSidebar;
