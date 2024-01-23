import SmallPostSkeleton from "@/components/loaders/SmallPostSkeleton";

type SmallPostsFallbackProps = {
  count?: number;
};

const SmallPostsFallback = ({ count = 9 }: SmallPostsFallbackProps) => {
  return (
    <section className="grid-container gap-4">
      {Array.from({ length: count }).map((_, index) => {
        return (
          <div key={index}>
            <SmallPostSkeleton ShowStats={false} showUser={false} />
          </div>
        );
      })}
    </section>
  );
};

export default SmallPostsFallback;
