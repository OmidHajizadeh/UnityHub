import { NavLink } from "react-router-dom";

const bottombarLinks = [
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
    imageUrl: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "ذخیره شده",
  },
  {
    imageUrl: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "پست جدید",
  },
];

const Bottombar = () => {
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link, index) => (
        <NavLink
          key={index}
          to={link.route}
          className="bottombar-link flex-center flex-1 flex-col gap-1 p-2 rounded-[10px] transition"
        >
          <img
            src={link.imageUrl}
            alt={link.label}
            className="transition"
            width={16}
            height={16}
          />
          <p className="tiny-medium text-light-2">{link.label}</p>
        </NavLink>
      ))}
    </section>
  );
};

export default Bottombar;
