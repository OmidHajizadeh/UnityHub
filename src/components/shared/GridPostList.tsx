import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Post } from "@/types";
import PostStats from "./PostStats";
import UnityHubVideoPlayer from "./UnityHubVideoPlayer";

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
        {posts.map((post) => {
          return (
            <motion.div
              key={post.$id}
              className="relative w-full max-w-80 aspect-square"
              layout
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {post.mediaType === "video" && (
                <img
                  src="/icons/video.svg"
                  alt="video"
                  className="absolute z-10 top-2 right-2 h-4 w-4 xs:w-6 xs:h-6 lg:top-4 lg:right-4 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full"
                />
              )}
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                {post.mediaType === "video" ? (
                  <UnityHubVideoPlayer isListItem videoUrl={post.imageUrl} />
                ) : (
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover "
                  />
                )}
              </Link>
              <div className={showUser || showStats ? "grid-post_user" : ""}>
                {showUser && (
                  <Link
                    to={`/profile/${post.creator.$id}`}
                    className="flex items-center justify-start gap-2 flex-1"
                  >
                    <img
                      src={post.creator.imageUrl}
                      alt={post.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post.creator.name}</p>
                  </Link>
                )}
                {showStats && (
                  <PostStats post={post as Post} showLikeCount={false} />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
};

export default GridPostList;
