import { motion } from "framer-motion";

import Spinner from "@/components/loaders/Spinner";
import { UnityHubDocumentList, User } from "@/types";
import UserCard from "./UserCard";

type SearchUserResultsProps = {
  isFetching: boolean;
  searchedUsers: UnityHubDocumentList<User> | undefined;
};

const SearchUserResults = ({
  isFetching,
  searchedUsers,
}: SearchUserResultsProps) => {
  if (isFetching)
    return (
      <motion.li
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute z-50 inset-0 flex justify-center pt-4 backdrop-blur-sm"
      >
        <Spinner size={40} />
      </motion.li>
    );

  if (searchedUsers && searchedUsers.documents.length > 0) {
    return (
      searchedUsers &&
      searchedUsers.documents.map((user) => {
        return (
          <motion.li
            layout
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            data-test={user?.$id}
            key={user?.$id}
            className="flex-1 min-w-[200px] w-full"
          >
            <UserCard user={user} />
          </motion.li>
        );
      })
    );
  }

  return (
    <li
      className="text-light-4 text-center w-full mt-10"
      style={{ gridColumn: "1/-1" }}
    >
      نتیجه ای پیدا نشد
    </li>
  );
};

export default SearchUserResults;
