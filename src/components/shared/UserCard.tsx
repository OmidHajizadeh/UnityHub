import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import GlowingCard from "./GlowingCard";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <GlowingCard size="small" className="rounded-xl after:rounded-[11px]">
      <Link to={`/profile/${user.$id}`} className="user-card">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
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

        <Button type="button" size="sm" className="shad-button_primary px-5">
          دنبال کردن
        </Button>
      </Link>
    </GlowingCard>
  );
};

export default UserCard;
