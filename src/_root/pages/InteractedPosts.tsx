import GridPostList from "@/components/shared/GridPostList";
import SmallPostsFallback from "@/components/suspense-fallbacks/SmallPostsFallback";
import { useGetCurrentUser } from "@/hooks/react-query/queriesAndMutaions";
import { Helmet } from "react-helmet";

type InteractedPostsProps = {
  type: "liked" | "saved";
  title: string;
  noResultText: string;
};

const InteractedPosts = ({
  type,
  title,
  noResultText,
}: InteractedPostsProps) => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <SmallPostsFallback count={6} />
      </div>
    );

  let posts;

  switch (type) {
    case "liked":
      posts = currentUser.liked;
      break;
    case "saved":
      posts = currentUser.saved;
      break;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">{noResultText}</p>
      )}
      <GridPostList posts={posts} showStats={false} />
    </>
  );
};

export default InteractedPosts;
