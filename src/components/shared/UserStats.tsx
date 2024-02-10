type StabBlockProps = {
  value: string | number;
  label: string;
};

const UserStats = ({ value, label }: StabBlockProps) => {
  return (
    <div className="flex-center gap-2 text-sm">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="tiny-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
};

export default UserStats;
