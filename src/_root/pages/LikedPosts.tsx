import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/hooks/react-query/queriesAndMutaions";
import { Helmet } from "react-helmet";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>پست های لایک شده</title>
      </Helmet>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">پستی لایک نکرده اید</p>
      )}
      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
