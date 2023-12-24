const UsersCardSkeleton = () => {
  return (
    <div className="user-card">
      <div className="rounded-full w-14 h-14 bg-slate-300 animate-pulse" />

      <div className="flex-center flex-col gap-1">
        <div className="bg-light-1 rounded-md h-4 w-24 animate-pulse" />
        <div className="bg-light-3 rounded-md h-4 w-12 animate-pulse" />
      </div>

      <div className="shad-button_primary w-full max-w-[8rem] h-8 rounded-xl animate-pulse" />
    </div>
  );
};

export default UsersCardSkeleton;
