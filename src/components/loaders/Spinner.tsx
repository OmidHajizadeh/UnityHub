type SpinnerProps = {
  size?: number;
};

const Spinner = ({ size = 24 }: SpinnerProps) => {
  return (
    <div className="flex-center w-full">
      <img
        src="/icons/loader.svg"
        alt="loader"
        width={size}
        height={size}
      />
    </div>
  );
};

export default Spinner;
