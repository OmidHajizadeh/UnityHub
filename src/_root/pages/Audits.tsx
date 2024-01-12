import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet";

import AuditsFallback from "@/components/suspense-fallbacks/AuditsFallback";
import { useToast } from "@/components/ui/use-toast";
import { useGetAudits } from "@/hooks/react-query/queries";
import AuditList from "@/components/shared/AuditList";
import AuditSkeleton from "@/components/loaders/AuditSkeleton";

const Audits = () => {
  const {
    data: audits,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetAudits();
  const { ref, inView } = useInView();

  const { toast } = useToast();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (!audits || isPending) return <AuditsFallback />;

  if (isError) {
    toast({
      title: error.name,
      description: error.message,
      variant: "destructive",
    });
    return <AuditsFallback />;
  }

  return (
    <div className="explore-container">
      <Helmet>
        <title>گزارش ها</title>
      </Helmet>
      <div className="explore-inner_container">
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
          {audits.pages.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <AuditList audits={item.documents} />
              </React.Fragment>
            );
          })}
          <li ref={ref} className="-mt-4" />
          {hasNextPage &&
            Array.from({ length: 5 }).map((_, index) => {
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

export default Audits;
