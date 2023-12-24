import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import Loader from "@/components/loaders/Spinner";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import {
  useGetPosts,
  useSearchPosts,
} from "@/hooks/react-query/queriesAndMutaions";
import ExplorerGridList from "@/components/shared/ExplorerGridList";
import { Helmet } from "react-helmet";
import ExploreFallback from "@/components/suspense-fallbacks/ExploreFallback";
import SmallPostSkeleton from "@/components/loaders/SmallPostSkeleton";

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isPending: isFetching } =
    useSearchPosts(debouncedSearchValue);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) return <ExploreFallback />;

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);
  return (
    <div className="explore-container">
      <Helmet>
        <title>اکسپلورر</title>
      </Helmet>
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="جستجو"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">محبوب های امروز</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-3 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">همه</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap-gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isFetching={isFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">
            پست ها تمام شد
          </p>
        ) : (
          <ul className="grid-container">
            {posts.pages.map((item, index) => (
              <ExplorerGridList key={index} posts={item.documents} />
            ))}
          </ul>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <section ref={ref} className="grid-container mt-7">
          {Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={index}>
              <SmallPostSkeleton />
            </React.Fragment>
          ))}
        </section>
      )}
    </div>
  );
};

export default Explore;
