import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/hooks/react-query/queriesAndMutaions";
import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const sidebarLinks = [
  {
    imageUrl: "/assets/icons/home.svg",
    route: "/",
    label: "خانه",
  },
  {
    imageUrl: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "اکسپلورر",
  },
  {
    imageUrl: "/assets/icons/people.svg",
    route: "/all-users",
    label: "کاربران",
  },
  {
    imageUrl: "/assets/icons/add-post.svg",
    route: "/create-post",
    label: "پست جدید",
  },
];

const MainSidebar = () => {
  const { mutate: signOutHandler, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <nav className="rightsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.username}@</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-4">
          {sidebarLinks.map((link, index) => (
            <li key={index} className="rightsidebar-link group">
              <NavLink
                to={link.route}
                className="sidebarlink group flex gap-4 px-4 py-3 items-center"
              >
                <img
                  src={link.imageUrl}
                  alt={link.label}
                  className="group-hover:invert-white transition"
                />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost mt-4"
        onClick={() => signOutHandler()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">خروج از حساب کاربری</p>
      </Button>
    </nav>
  );
};

export default MainSidebar;
