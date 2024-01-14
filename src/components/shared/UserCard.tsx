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
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
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
          className="shad-button_primary px-5"
          targetUserId={user.$id}
          currentUserFollowings={currentUser?.followings || []}
        />
      )}
    </Link>
  );
};

export default UserCard;
