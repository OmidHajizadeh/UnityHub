import { Models } from "appwrite";
import { Helmet } from "react-helmet";


import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/hooks/react-query/queriesAndMutaions";
import { useUserContext } from "@/context/AuthContext";
import MediumPostSkeleton from "@/components/loaders/MediumPostSkeleton";
import React from "react";
import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  const { user } = useUserContext();

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <Helmet>
          <title>خطا</title>
        </Helmet>
        <div className="home-container">
          <p className="body-medium text-light-1">خطایی رخ داد</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">خطایی رخ داد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <Helmet>
        <title>خانه یونیتی هاب</title>
      </Helmet>
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold w-full">پست های دنبال کنندگان</h2>
          {isPostLoading && !posts ? (
            <section className="flex flex-col flex-1 gap-9 w-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <React.Fragment key={index}>
                  <MediumPostSkeleton />
                </React.Fragment>
              ))}
            </section>
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => {
                return (
                  <li key={post.$id}>
                    <PostCard post={post} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">اکانت های فعال</h3>
        {isUserLoading && !creators ? (
          <section className="grid 2xl:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <React.Fragment key={index}>
                <UsersCardSkeleton />
              </React.Fragment>
            ))}
          </section>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => {
              if (user.id === creator.$id) return;
              return (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
