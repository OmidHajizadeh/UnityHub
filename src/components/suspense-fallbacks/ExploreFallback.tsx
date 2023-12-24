import SmallPostSkeleton from "../loaders/SmallPostSkeleton";
import React from "react";

const ExploreFallback = () => {
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full h-12 rounded-lg bg-dark-4 animate-pulse" />
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">محبوب های امروز</h3>
        <div className="flex-center gap-3 bg-dark-4/60 rounded-xl px-4 py-3 animate-pulse w-14 h-8" />
      </div>

      <div className="flex flex-wrap-gap-9 w-full max-w-5xl">
        <section className="grid-container">
          {Array.from({ length: 9 }).map((_, index) => (
            <React.Fragment key={index}>
              <SmallPostSkeleton />
            </React.Fragment>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ExploreFallback;
