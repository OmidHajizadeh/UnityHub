import GlowingCard from "@/components/shared/GlowingCard";

const UsersCardSkeleton = () => {
  return (
    <GlowingCard size="small" className="rounded-xl after:rounded-[11px]">
      <div className="user-card">
        <div className="rounded-full w-14 h-14 bg-slate-300 animate-pulse" />

        <div className="flex-center flex-col gap-1">
          <div className="bg-light-1 rounded-md h-4 w-24 animate-pulse" />
          <div className="bg-light-3 rounded-md h-4 w-12 mt-3 animate-pulse" />
        </div>

        <div className="bg-primary-500 w-full max-w-[6rem] h-8 rounded-md animate-pulse" />
      </div>
    </GlowingCard>
  );
};


export default UsersCardSkeleton;
