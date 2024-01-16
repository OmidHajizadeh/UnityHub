import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import PostStats from "./PostStats";
import { Post } from "@/types";

type GridPostListProps = {
  posts: Post[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  return (
    <section className="grid-container">
      <AnimatePresence mode="popLayout">
        {posts.reverse().map((post) => {
          return (
            <motion.div
              key={post.$id}
              className="relative w-full max-w-80 aspect-square"
              layout
              exit={{ scale: 0.8, opacity: 0 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className={showUser || showStats ? "grid-post_user" : ""}>
                {showUser && (
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img
                      src={post.creator.imageUrl}
                      alt={post.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post.creator.name}</p>
                  </div>
                )}
                {showStats && <PostStats post={post} showLikeCount={false} />}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
};

export default GridPostList;
