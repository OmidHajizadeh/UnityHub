import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ArrowIcon from "/icons/arrow.png";
import FileUploadIcon from "/icons/file-upload.svg";
import { useGetUsers } from "@/hooks/tanstack-query/queries";
import UsersCardSkeleton from "@/components/loaders/UsersCardSkeleton";
import UserCard from "./UserCard";

const NoHomeFeed = () => {
  const { data: users, isLoading } = useGetUsers(4);

  return (
    <article className="w-full  max-w-5xl flex flex-col items-center">
      <img src={FileUploadIcon} className="w-32 h-32" alt="no feed" />
      <h4 className="my-3 h3-bold">هیچ پستی برای نمایش پیدا نشد</h4>
      <p>
        برای دیدن پست
        <Link to="/create-post" className="text-primary-500">
          {" "}
          از این صفحه{" "}
        </Link>
        یه پست جدید آپلود کنید
      </p>
      <p className="flex w-full px-4 items-center gap-4 my-4 text-light-3 after:h-px after:w-full after:bg-dark-4/80 before:h-px before:w-full before:bg-dark-4/80">
        یا
      </p>
      <div className="xl:hidden w-full">
        <p className="mb-5">یک یا چند تا از کاربر های زیر رو دنبال کنید</p>
        {isLoading ? (
          <section className="w-full grid gap-2 grid-cols-2 lg:gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div key={index} className="flex-1 min-w-[200px] w-full">
                  <UsersCardSkeleton />
                </div>
              );
            })}
          </section>
        ) : (
          <ul className="w-full grid gap-2 grid-cols-2 lg:gap-4">
            <AnimatePresence mode="popLayout">
              {users &&
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
      <div className="hidden xl:flex items-center gap-8 flex-col w-full">
        <p>از منو سمت راست یک یا چند کاربر را دنبال کنید</p>
        <img src={ArrowIcon} alt="arrow" />
      </div>
    </article>
  );
};

export default NoHomeFeed;
