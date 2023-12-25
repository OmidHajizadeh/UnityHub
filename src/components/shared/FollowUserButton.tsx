import { useState } from "react";

import { useFollowUser } from "@/hooks/react-query/queriesAndMutaions";
import { Button } from "../ui/button";
import Spinner from "../loaders/Spinner";

type FollowUserButtonProps = {
  className: string;
  targetUserId: string;
  currentUserFollowings: string[];
};

const FollowUserButton = ({
  className,
  targetUserId,
  currentUserFollowings,
}: FollowUserButtonProps) => {
  const [hadFollowedUser, setHadFollowedUser] = useState(
    currentUserFollowings.includes(targetUserId)
  );

  const { mutateAsync: followAction, isPending: isFollowActionOn } =
    useFollowUser(targetUserId);
  async function followUserHandler(
    action: "follow" | "unfollow",
    e: React.MouseEvent
  ) {
    e.preventDefault();
    try {
      await followAction(action);
      setHadFollowedUser(!hadFollowedUser);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button
      onClick={followUserHandler.bind(
        this,
        hadFollowedUser ? "unfollow" : "follow"
      )}
      type="button"
      size="sm"
      className={className}
      disabled={isFollowActionOn}
    >
      {isFollowActionOn ? (
        <>
          <Spinner />
          درحال انجام...
        </>
      ) : hadFollowedUser ? (
        "دنبال نکردن"
      ) : (
        "دنبال کردن"
      )}
    </Button>
  );
};

export default FollowUserButton;
