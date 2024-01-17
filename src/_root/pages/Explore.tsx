import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AppwriteException } from "appwrite";

import SearchPostResults from "@/components/shared/SearchPostResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import {
  useGetExplorerPosts,
  useSearchPosts,
} from "@/hooks/react-query/queries";
import ExplorerGridList from "@/components/shared/ExplorerGridList";
import ExploreFallback from "@/components/suspense-fallbacks/ExploreFallback";
import SmallPostSkeleton from "@/components/loaders/SmallPostSkeleton";
import { UnityHubError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: searchedPosts,
    isPending: isFetching,
    isError: isSearchError,
    error: searchError,
  } = useSearchPosts(debouncedSearchValue);

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isError: isPostsError,
    error: postsError,
  } = useGetExplorerPosts();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  if (isPostsError) {
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
    return <ExploreFallback />;
  }
  if (isSearchError) {
    if (searchError instanceof UnityHubError) {
      toast({
        title: searchError.title,
        description: searchError.message,
        variant: "destructive",
      });
    } else if (searchError instanceof AppwriteException) {
      toast({
        title: searchError.name,
        description: searchError.message,
        variant: "destructive",
      });
    } else {
      console.log(searchError);
      toast({
        title: "خطا در دریافت پست ها",
        description: "لطفاً دوباره امتحان کنید.",
        variant: "destructive",
      });
    }
    return <ExploreFallback />;
  }

  if (!posts) return <ExploreFallback />;

  const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="common-container">
      <Helmet>
        <title>اکسپلورر</title>
      </Helmet>
      <div className="common-container_inner">
        <div className="hidden md:flex gap-2 w-full max-w-5xl">
          <img
            src="/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/icons/search.svg" alt="search" width={24} height={24} />
          <Input
            type="text"
            placeholder="جستجو متن پست..."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="relative w-full max-w-5xl">
        <ul className="grid-container">
          <AnimatePresence key="animate-presence" mode="popLayout">
            {shouldShowSearchResults ? (
              <SearchPostResults
                isFetching={isFetching}
                searchedPosts={searchedPosts}
              />
            ) : (
              !searchedPosts &&
              posts.pages.map((item, index) => (
                <React.Fragment key={`posts-${index}`}>
                  <ExplorerGridList posts={item.documents} />
                </React.Fragment>
              ))
            )}
            {hasNextPage && !searchValue && (
              <>
                <SmallPostSkeleton ShowStats={false} ref={ref} />
                {Array.from({ length: 2 }).map((_, index) => (
                  <React.Fragment key={`skeleton-${index}`}>
                    <SmallPostSkeleton ShowStats={false} />
                  </React.Fragment>
                ))}
              </>
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default Explore;
