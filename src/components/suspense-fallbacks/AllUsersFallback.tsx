import UsersCardSkeleton from "../loaders/UsersCardSkeleton";
import GlowingCard from "../shared/GlowingCard";

const AllUsersFallback = () => {
  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">همه کاربران</h2>
        </div>
        <section className="user-grid">
          {Array.from({ length: 9 }).map((_, index) => {
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
