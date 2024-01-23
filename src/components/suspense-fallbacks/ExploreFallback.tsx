import React from "react";

import SmallPostSkeleton from "@/components/loaders/SmallPostSkeleton";

const ExploreFallback = () => {
  return (
    <div className="common-container">
      <div className="common-container_inner">
        <div className="hidden md:flex gap-2 w-full max-w-5xl">
          <img
            src="/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full h-12 rounded-lg bg-dark-4 animate-pulse" />
      </div>

      <div className="relative w-full max-w-5xl">
        <section className="grid-container">
          {Array.from({ length: window.innerWidth > 400 ? 9 : 12 }).map(
            (_, index) => (
              <React.Fragment key={index}>
                <SmallPostSkeleton />
              </React.Fragment>
            )
          )}
        </section>
      </div>
    </div>
  );
};

export default ExploreFallback;
