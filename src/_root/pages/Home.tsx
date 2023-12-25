import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/hooks/react-query/queriesAndMutaions";
import MediumPostSkeleton from "@/components/loaders/MediumPostSkeleton";
import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    fetchNextPage,
    hasNextPage,
  } = useGetRecentPosts();

  const { ref, inView } = useInView();
  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // const shouldShowPosts = posts.pages.every(
  //   (item) => item?.documents.length === 0
  // );

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
              <AnimatePresence mode="popLayout">
                {posts?.pages.map((item) => {
                  return item?.documents.map((post) => {
                    return (
                      <motion.li
                        layout
                        exit={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={post.$id}
                        transition={{ duration: 0.2 }}
                      >
                        <PostCard post={post} />
                      </motion.li>
                    );
                  });
                })}
              </AnimatePresence>
            </ul>
          )}
          {hasNextPage && (
            <section ref={ref} className="flex flex-col flex-1 gap-9 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <React.Fragment key={index}>
                  <MediumPostSkeleton />
                </React.Fragment>
              ))}
            </section>
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
