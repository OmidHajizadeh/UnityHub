import SmallPostsFallback from "./SmallPostsFallback";

const ProfileFallback = () => {
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex-start w-full grow gap-4">
          <div className="w-28 h-28 lg:h-36 lg:w-36 rounded-full bg-slate-500 animate-pulse" />

          <div className="flex flex-col flex-1 justify-between gap-6 md:mt-2">
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full max-w-[15rem] h-8 rounded-md bg-light-2 animate-pulse" />
              <div className="bg-light-3 w-full max-w-[8rem] rounded-md h-5 animate-pulse" />
            </div>

            <div className="flex-start gap-4 lg:gap-8 items-center z-20">
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="hidden lg:block max-w-[8rem] w-full h-10 bg-dark-4 rounded-lg animate-pulse" />
      </div>

      <div className="w-full self-start max-w-[15rem] h-5 rounded-md bg-light-2 animate-pulse" />

      <hr className="border border-dark-4/80 w-full hidden lg:block" />

      <div className="flex lg:hidden w-full h-10 bg-dark-4 rounded-lg animate-pulse" />

      <SmallPostsFallback count={6} />
    </div>
  );
};

export default ProfileFallback;
