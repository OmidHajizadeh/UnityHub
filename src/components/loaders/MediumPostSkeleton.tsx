import GlowingCard from "../shared/GlowingCard";

const MediumPostSkeleton = () => {
  return (
    <GlowingCard className="post-card after:rounded-[23px]">
      <div className="flex flex-between">
        <div className="flex items-center gap-3 grow">
          <div className="rounded-full shrink-0 w-12 lg:h-12 bg-slate-600 animate-pulse" />
          <div className="flex flex-col gap-3 w-full grow">
            <div className="bg-light-1 rounded-sm max-w-[10rem] h-4 animate-pulse" />
            <div className="flex-center gap-2 bg-light-3 h-4 max-w-[7rem] animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
      <div>
        <div className="small-medium lg:base-medium py-5">
          <div className="flex-col flex gap-3">
            <div className="animate-pulse bg-light-2 h-4 rounded-sm w-full" />
            <div className="animate-pulse bg-light-2 h-4 rounded-sm w-full" />
            <div className="animate-pulse bg-light-2 h-4 rounded-sm w-full max-w-sm" />
          </div>
        </div>
        <div className="h-64 xs:h-[400px] lg:h-[450px] w-full bg-light-4 rounded-[24px] mb-5 animate-pulse" />
      </div>
      <div className="flex-between gap-3 z-20 relative">
        <div className="w-8 h-8 rounded-md animate-pulse bg-light-4" />
        <div className="w-8 h-8 rounded-md animate-pulse bg-light-4" />
      </div>
    </GlowingCard>
  );
};

export default MediumPostSkeleton;
