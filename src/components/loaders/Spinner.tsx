import SpinnerIcon from "/icons/loader.svg";

type SpinnerProps = {
  size?: number;
};

const Spinner = ({ size = 24 }: SpinnerProps) => {
  return (
    <div className="flex-center w-full">
      <img src={SpinnerIcon} alt="loader" width={size} height={size} />
    </div>
  );
};

export default Spinner;
