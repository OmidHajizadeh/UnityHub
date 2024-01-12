const AuditSkeleton = () => {
  return (
    <li className="rounded-lg p-3 bg-dark-4 flex items-center gap-3 w-full">
      <div className="rounded-full h-14 w-14 shrink-0 bg-slate-500 animate-pulse" />
      <div className="flex-between gap-3 grow">
        <div className="flex flex-col w-full gap-2">
          <div className="h-3 w-32 rounded-sm bg-light-3 animate-pulse" />
          <div className="h-4 w-full max-w-[20rem] rounded-sm bg-slate-200 animate-pulse" />
          <div className="h-3 w-full max-w-[5rem] rounded-sm bg-light-4 animate-pulse" />
        </div>
        <div className="rounded-md shrink-0 h-20 w-20 bg-slate-500 animate-pulse" />
      </div>
    </li>
  );
};

export default AuditSkeleton;
