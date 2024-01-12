import React from "react";
import AuditSkeleton from "../loaders/AuditSkeleton";

const AuditsFallback = () => {
  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/notification.svg"
            width={36}
            height={36}
            alt="audits"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">گزارش ها</h2>
        </div>
        <ul className="flex flex-col gap-4 w-full">
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <React.Fragment key={index}>
                <AuditSkeleton />
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AuditsFallback;
