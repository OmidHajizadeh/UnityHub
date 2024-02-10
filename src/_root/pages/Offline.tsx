import Logo from "/images/icon.svg";

const Offline = () => {
  return (
    <div className="h-screen w-screen grid place-items-center bg-auth bg-no-repeat bg-cover bg-center">
      <div className="text-center flex-center flex-col gap-4">
        <img src={Logo} alt="unityhub" className="w-14 lg:w-24 h-14 lg:h-24" />
        <h3 className="h3-bold">عدم برقراری ارتباط</h3>
        <p>لطفاً اینترنت خود را چک کنید</p>
      </div>
    </div>
  );
};

export default Offline;
