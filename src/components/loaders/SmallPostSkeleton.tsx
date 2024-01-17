import React from "react";

type SmallPostSkeletonProps = {
  ShowStats?: boolean;
  showUser?: boolean;
};

const SmallPostSkeleton = React.forwardRef(
  (
    { ShowStats = true, showUser = true }: SmallPostSkeletonProps,
    ref: React.LegacyRef<HTMLLIElement>
  ) => {
    return (
      <li className="w-full relative mx-w-80 aspect-square" ref={ref}>
        <div className="grid-post_link">
          <div className="w-full h-full animate-pulse bg-slate-500" />
        </div>
        {showUser ||
          (ShowStats && (
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <div className="w-8 h-8 shrink-0 rounded-full animate-pulse bg-slate-300" />
                  <div className="max-w-[8rem] h-3 w-full rounded-md animate-pulse bg-slate-300" />
                </div>
              )}

              {ShowStats && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg animate-pulse bg-slate-300" />
                  <div className="w-6 h-6 rounded-lg animate-pulse bg-slate-300" />
                </div>
              )}
            </div>
          ))}
      </li>
    );
  }
);

export default SmallPostSkeleton;
