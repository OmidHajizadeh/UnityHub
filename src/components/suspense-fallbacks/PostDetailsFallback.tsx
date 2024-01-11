import React from "react";
import CommentSkeleton from "../loaders/CommentSkeleton";

const PostDetailsFallback = () => {
  return (
    <div className="post_details-container">
      <div className="post_details-card gap-3">
        <div className="h-80 lg:h-[480px] xl:w-[48%] rounded-[30px] object-cover p-5 bg-dark-4 animate-pulse" />
        <div className="post_details-info animate-pulse bg-dark-4">
          <div className="flex-between w-full">
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 lg:w-12 lg:h-12 bg-slate-400 animate-pulse" />
              <div className="flex flex-col gap-3 grow">
                <div className="bg-light-1 rounded-md w-12 h-4 max-w-sm animate-pulse" />
                <div className="bg-light-3 rounded-md w-24 h-4 max-w-md animate-pulse" />
              </div>
            </div>
          </div>

          <hr className="border border-dark-4/80 w-full" />

          <div className="flex flex-1 flex-col w-full gap-3">
            <div className="bg-light-1 rounded-md h-4 w-full animate-pulse" />
            <div className="bg-light-1 rounded-md h-4 w-full animate-pulse" />
            <div className="bg-light-1 rounded-md h-4 max-w-sm animate-pulse" />
          </div>

          <div className="w-full flex-between">
            <div className="w-9 h-8 rounded-md bg-light-3 animate-pulse" />
            <div className="flex gap-4">
              <div className="w-9 h-8 rounded-md bg-light-3 animate-pulse" />
              <div className="w-9 h-8 rounded-md bg-light-3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <ul
        dir="rtl"
        className="w-full max-w-5xl p-3 flex flex-col gap-3 bg-dark-3 rounded-xl"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <CommentSkeleton />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default PostDetailsFallback;
