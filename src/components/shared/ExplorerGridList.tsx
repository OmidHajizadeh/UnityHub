import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type ExplorerGridListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const ExplorerGridList = ({
  posts,
  showUser = true,
  showStats = true,
}: ExplorerGridListProps) => {
  const { user } = useUserContext();
  return posts.map((post) => {
    return (
      <li key={post.$id} className="relative min-w-80 h-80">
        <Link to={`/posts/${post.$id}`} className="grid-post_link">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="grid-post_user">
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
          {showStats && <PostStats post={post} userId={user.id} />}
        </div>
      </li>
    );
  });
};

export default ExplorerGridList;
