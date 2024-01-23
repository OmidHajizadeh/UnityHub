import React from "react";

import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";

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
              <React.Fragment key={index}>
                <UsersCardSkeleton />
              </React.Fragment>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default AllUsersFallback;
