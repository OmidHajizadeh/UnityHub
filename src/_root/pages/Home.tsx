import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AppwriteException } from "appwrite";

import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetHomeFeed, useGetUsers } from "@/hooks/react-query/queries";
import MediumPostSkeleton from "@/components/loaders/MediumPostSkeleton";
import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";
import { UnityHubError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Post } from "@/types";
import NoHomeFeed from "@/components/shared/NoHomeFeed";

const Home = () => {
  const { ref, inView } = useInView();
  const { toast } = useToast();

  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    error: postsError,
    fetchNextPage,
    hasNextPage,
  } = useGetHomeFeed();

  const {
    data: users,
    isPending: areUsersLoading,
    isError: isErrorUsers,
    error: usersError,
  } = useGetUsers(6);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isErrorPosts) {
    if (postsError instanceof UnityHubError) {
      toast({
        title: postsError.title,
        description: postsError.message,
        variant: "destructive",
      });
    } else if (postsError instanceof AppwriteException) {
      toast({
        title: postsError.name,
        description: postsError.message,
        variant: "destructive",
      });
    } else {
      console.log(postsError);
      toast({
        title: "خطا در دریافت پست ها",
        description: "لطفاً دوباره امتحان کنید.",
        variant: "destructive",
      });
    }
  }

  if (isErrorUsers) {
    if (usersError instanceof UnityHubError) {
      toast({
        title: usersError.title,
        description: usersError.message,
        variant: "destructive",
      });
    } else if (usersError instanceof AppwriteException) {
      toast({
        title: usersError.name,
        description: usersError.message,
        variant: "destructive",
      });
    } else {
      console.log(usersError);
      toast({
        title: "خطا در دریافت کاربران",
        description: "لطفاً دوباره امتحان کنید.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-1 h-full">
      <Helmet>
        <title>خانه یونیتی هاب</title>
      </Helmet>
      <div className="home-container self-center">
        <div className="home-posts">
          {isPostLoading && (
            <section className="home-feed">
              {Array.from({ length: 3 }).map((_, index) => (
                <React.Fragment key={index}>
                  <MediumPostSkeleton />
                </React.Fragment>
              ))}
            </section>
          )}
          {isErrorPosts && (
            <p className="body-medium text-light-1">خطایی رخ داد</p>
          )}
          {posts && (
            <ul className="home-feed">
              <AnimatePresence mode="popLayout">
                {posts.pages.map((item) => {
                  return item?.documents.map((post) => {
                    return (
                      <motion.li
                        layout
                        exit={{ scale: 0.8, opacity: 0 }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={post.$id}
                        transition={{ duration: 0.2 }}
                      >
                        <PostCard post={post as Post} />
                      </motion.li>
                    );
                  });
                })}
                {posts.pages[0].total === 0 && (
                  <motion.li
                    layout
                    exit={{ scale: 0.8, opacity: 0 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-light-4 text-center w-full"
                  >
                    <NoHomeFeed />
                  </motion.li>
                )}
              </AnimatePresence>
            </ul>
          )}
          {hasNextPage && (
            <section ref={ref} className="home-feed -mt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <React.Fragment key={index}>
                  <MediumPostSkeleton />
                </React.Fragment>
              ))}
            </section>
          )}
        </div>
      </div>
      <div className="home-users">
        <h3 className="h3-bold text-center text-light-1">آخرین کاربران</h3>
        {areUsersLoading && (
          <section className="grid 2xl:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <React.Fragment key={index}>
                <UsersCardSkeleton />
              </React.Fragment>
            ))}
          </section>
        )}
        {isErrorUsers && (
          <p className="body-medium text-light-1">خطایی رخ داد</p>
        )}
        {users && (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {users.documents.map((creator) => {
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
