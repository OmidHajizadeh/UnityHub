import { Link } from "react-router-dom";

import Logo from "/images/icon.svg";

const NotFound = () => {
  return (
    <div className="h-screen w-screen grid place-items-center">
      <div className="text-center flex-center flex-col gap-4">
        <img src={Logo} alt="unityhub" className="w-14 lg:w-24 h-14 lg:h-24" />
        <h3 className="h3-bold">صفحه مورد نظر پیدا نشد :(</h3>
        <Link to="/">رفتن به خانه</Link>
      </div>
    </div>
  );
};

export default NotFound;
