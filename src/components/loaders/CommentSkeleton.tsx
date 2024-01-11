const CommentSkeleton = () => {
  return (
    <li className="flex w-full items-start gap-3 bg-dark-2 p-3 rounded-lg">
      <div className="h-14 w-14 rounded-full shrink-0 bg-slate-600 animate-pulse" />
      <div className="flex flex-col gap-1 w-full">
        <div className="bg-light-3 h-4 animate-pulse rounded-sm max-w-[5rem]" />
        <div className="bg-light-2 h-4 animate-pulse rounded-sm max-w-md" />
        <div className="bg-light-4 h-4 animate-pulse rounded-sm max-w-[4rem]" />
      </div>
    </li>
  );
};

export default CommentSkeleton;
