import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/hooks/react-query/queriesAndMutaions";

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
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">پستی لایک نکرده اید</p>
      )}

      <ul className="grid-container">
        <GridPostList posts={currentUser.liked} showStats={false} />
      </ul>
    </>
  );
};

export default LikedPosts;
