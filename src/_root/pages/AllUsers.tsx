import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet";

import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";
import SearchUserResults from "@/components/shared/SearchUserResults";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers, useSearchUser } from "@/hooks/react-query/queries";
import useDebounce from "@/hooks/use-debounce";

const AllUsers = () => {
  const { toast } = useToast();
  const {
    data: creators,
    isLoading,
    isError: isErrorCreators,
  } = useGetUsers(6);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data: searchedUsers, isPending: isFetching } =
    useSearchUser(debouncedSearchValue);

  const shouldShowSearchResults = searchValue !== "";

  if (isErrorCreators) {
    toast({
      title: "خطا در دریافت کاربران",
      description: "لطفاً دوباره امتحان کنید.",
      variant: "destructive",
    });
  }

  return (
    <div className="common-container">
      <Helmet>
        <title>همه کاربران</title>
      </Helmet>
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="users"
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
            placeholder="جستجو نام کاربری..."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="user-container mt-8 mb-7 relative">
        <h2 className="body-bold md:h3-bold">
          {searchValue.trim() !== "" ? "" : "کاربران اخیر"}
        </h2>
        {isLoading && !creators ? (
          <section className="user-grid">
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <div key={index} className="flex-1 min-w-[200px] w-full">
                  <UsersCardSkeleton />
                </div>
              );
            })}
          </section>
        ) : (
          <ul className="user-grid">
            <AnimatePresence mode="popLayout">
              {shouldShowSearchResults && (
                <SearchUserResults
                  isFetching={isFetching}
                  searchedUsers={searchedUsers}
                />
              )}
              {!searchedUsers &&
                creators?.documents.map((creator) => {
                  return (
                    <motion.li
                      key={creator?.$id}
                      layout
                      exit={{ scale: 0.8, opacity: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-[200px] w-full"
                    >
                      <UserCard user={creator} />
                    </motion.li>
                  );
                })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
