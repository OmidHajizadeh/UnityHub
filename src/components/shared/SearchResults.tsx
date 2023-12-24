import { Models } from "appwrite";
import React from "react";
import Loader from "../loaders/Spinner";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isFetching: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({ isFetching, searchedPosts }: SearchResultsProps) => {
  if (isFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0)
    return <GridPostList posts={searchedPosts.documents} />;
  return (
    <p className="text-light-4 text-center w-full mt-10">نتیجه ای پیدا نشد</p>
  );
};

export default SearchResults;
