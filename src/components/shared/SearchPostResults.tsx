import React from "react";
import { Models } from "appwrite";
import { motion } from "framer-motion";

import Spinner from "@/components/loaders/Spinner";
import ExplorerGridList from "./ExplorerGridList";

type SearchPostResultsProps = {
  isFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
};

const SearchPostResults = React.forwardRef(
  (
    { isFetching, searchedPosts }: SearchPostResultsProps,
    ref: React.Ref<HTMLLIElement>
  ) => {
    if (isFetching)
      return (
        <motion.li
          key="spinner"
          ref={ref}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 inset-0 flex justify-center pt-4 backdrop-blur-sm"
        >
          <Spinner size={40} />
        </motion.li>
      );

    if (searchedPosts && searchedPosts.documents.length > 0)
      return <ExplorerGridList posts={searchedPosts.documents} />;
    return (
      <li
        key="no-result"
        className="text-light-4 text-center w-full mt-10"
        style={{ gridColumn: "1/-1" }}
      >
        نتیجه ای پیدا نشد
      </li>
    );
  }
);

export default SearchPostResults;
