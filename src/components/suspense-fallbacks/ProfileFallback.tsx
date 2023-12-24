import SmallPostsFallback from "./SmallPostsFallback";

const ProfileFallback = () => {
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-4">
          <div className="w-28 h-28 lg:h-36 lg:w-36 rounded-full bg-slate-500 animate-pulse" />

          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full gap-3">
              <div className="w-full max-w-md h-8 rounded-md bg-light-2 animate-pulse" />
              <div className="bg-light-3 w-full max-w-[10rem] rounded-md h-5 animate-pulse" />
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
              <div className="w-full max-w-[5rem] h-5 rounded-md bg-light-4 animate-pulse" />
            </div>

            <div className="flex flex-col mt-7 gap-3">
              <div className="w-full rounded-sm h-3 bg-light-2 animate-pulse" />
              <div className="w-full rounded-sm max-w-sm h-3 bg-light-2 animate-pulse" />
            </div>
          </div>

          <div className="max-w-[10rem] w-full h-12 bg-dark-4 rounded-lg animate-pulse" />
        </div>
      </div>

      <SmallPostsFallback count={6} />
    </div>
  );
};

export default ProfileFallback;
