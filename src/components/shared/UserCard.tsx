import { Models } from "appwrite";
import { Link } from "react-router-dom";

import FollowUserButton from "./FollowUserButton";
import { useGetCurrentUser } from "@/hooks/react-query/queries";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { data: currentUser } = useGetCurrentUser();

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/icons/profile-placeholder.svg"}
        alt={user.name}
        className="rounded-full relative z-20 w-14 h-14"
      />
      {user.imageUrl && (
        <div className="absolute aspect-square inset-y-0 -translate-x-1/3 -m-2 after:absolute after:inset-0 after:bg-black/50 after:z-[11] before:absolute before:z-[11] before:w-32 before:block before:h-full before:bg-gradient-to-r before:from-transparent before:to-dark-4">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="text-transparent w-full h-full"
          />
        </div>
      )}

      <div className="flex-center relative z-20 flex-col gap-1">
        <p
          dir="auto"
          className="base-medium text-light-1 text-center line-clamp-1"
        >
          {user.name}
        </p>
        <p
          dir="auto"
          className="small-regular text-light-3 text-center line-clamp-1"
        >
          @{user.username}
        </p>
      </div>
      {currentUser?.$id !== user.$id && (
        <FollowUserButton
          className="shad-button_primary relative z-20 px-5"
          targetUserId={user.$id}
        />
      )}
    </Link>
  );
};

export default UserCard;
