import UsersCardSkeleton from "../loaders/UsersCardSkeleton";
import GlowingCard from "../shared/GlowingCard";

const AllUsersFallback = () => {
  return (
    <div className="common-container">
      <div className="common-container_inner">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/icons/people.svg"
            width={36}
            height={36}
            alt="users"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full h-12 rounded-lg bg-dark-4 animate-pulse" />
      </div>

      <div className="user-container mt-8">
        <h2 className="body-bold md:h3-bold">کاربران اخیر</h2>
        <section className="user-grid">
          {Array.from({ length: 6 }).map((_, index) => {
            return (
              <div key={index} className="flex-1 min-w-[200px] w-full">
                <GlowingCard
                  size="small"
                  className="rounded-xl after:rounded-[11px]"
                >
                  <UsersCardSkeleton />
                </GlowingCard>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default AllUsersFallback;
