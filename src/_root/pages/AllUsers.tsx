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
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetUsers(6);

  const { data: searchedUsers, isPending: isFetching } =
    useSearchUser(debouncedSearchValue);

  if (isErrorUsers) {
    toast({
      title: "خطا در دریافت کاربران",
      description: "لطفاً دوباره امتحان کنید.",
      variant: "destructive",
    });
  }

  const shouldShowSearchResults = searchValue.trim().length !== 0;

  return (
    <div className="common-container">
      <Helmet>
        <title>همه کاربران</title>
      </Helmet>
      <div className="common-container_inner">
        <div className="hidden md:flex gap-2 w-full max-w-5xl">
          <img
            src="/icons/people.svg"
            width={36}
            height={36}
            alt="users"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">جستجو</h2>
        </div>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/icons/search.svg"
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
      <div className="user-container relative">
        {!shouldShowSearchResults && (
          <h2 className="body-bold md:h3-bold text-center w-full md:text-start">کاربران اخیر</h2>
        )}
        {isLoadingUsers ? (
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
                users &&
                users.documents.map((user) => {
                  return (
                    <motion.li
                      key={user.$id}
                      layout
                      exit={{ scale: 0.8, opacity: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 w-full"
                    >
                      <UserCard user={user} />
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
