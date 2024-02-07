import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AppwriteException } from "appwrite";

import WallpaperIcon from "/icons/wallpaper.svg";
import SearchIcon from "/icons/search.svg";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ExploreFallback from "@/components/suspense-fallbacks/ExploreFallback";
import ExplorerGridList from "@/components/shared/ExplorerGridList";
import SmallPostSkeleton from "@/components/loaders/SmallPostSkeleton";
import SearchPostResults from "@/components/shared/SearchPostResults";
import useDebounce from "@/hooks/use-debounce";
import { useSearchPosts } from "@/hooks/tanstack-query/queries";
import { useGetExplorerPosts } from "@/hooks/tanstack-query/infiniteQueries";
import { UnityHubError } from "@/lib/utils";
import { usePWAContext } from "@/context/PWAContextProvider";

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { defferedEvent } = usePWAContext();

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
    if (defferedEvent) {
      defferedEvent.prompt();
    }
  }, []);

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

  const currentLoadedPostsCount = posts.pages.reduce((total, currentPage) => {
    return total + currentPage.documents.length;
  }, 0);

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowSkeletons =
    currentLoadedPostsCount % posts?.pages[0].total !== 0 &&
    hasNextPage &&
    !searchValue;

  return (
    <>
      <Helmet>
        <title>اکسپلورر</title>
      </Helmet>
      <div className="common-container">
        <div className="common-container_inner">
          <div className="hidden md:flex gap-2 w-full max-w-5xl">
            <img
              src={WallpaperIcon}
              width={36}
              height={36}
              alt="edit"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
          </div>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
            <img src={SearchIcon} alt="جستجو" width={24} height={24} />
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
              {shouldShowSkeletons && (
                <>
                  <SmallPostSkeleton ShowStats={false} ref={ref} />
                  {Array.from({
                    length: 2,
                  }).map((_, index) => (
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
    </>
  );
};

export default Explore;
