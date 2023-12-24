import SmallPostSkeleton from "../loaders/SmallPostSkeleton";

type SmallPostsFallbackProps = {
  count?: number;
};

const SmallPostsFallback = ({ count = 9 }: SmallPostsFallbackProps) => {
  return (
    <section className="grid-container">
      {Array.from({ length: count }).map((_, index) => {
        return (
          <div key={index} className="relative min-w-80 h-80">
            <SmallPostSkeleton ShowStats={false} />
          </div>
        );
      })}
    </section>
  );
};

export default SmallPostsFallback;
