import { useState } from "react";

import { Button } from "../ui/button";
import Spinner from "../loaders/Spinner";
import { useFollowUser } from "@/hooks/react-query/mutations";
import { useToast } from "../ui/use-toast";
import { UnityHubError } from "@/lib/utils";
import { AppwriteException } from "appwrite";

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

  const { toast } = useToast();

  const { mutateAsync: followAction, isPending: isFollowActionOn } =
    useFollowUser(targetUserId);
  console.log(targetUserId, hadFollowedUser);

  async function followUserHandler(
    action: "follow" | "unfollow",
    e: React.MouseEvent
  ) {
    e.preventDefault();
    try {
      await followAction(action);
      setHadFollowedUser((prev) => !prev);
    } catch (error) {
      if (error instanceof UnityHubError) {
        return toast({
          title: error.title,
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof AppwriteException) {
        return toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(error);
        return toast({
          title: "عملیات با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
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
      className={`${className} ${
        hadFollowedUser ? "bg-primary-400" : "bg-primary-500"
      }`}
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
