import { AppwriteException } from "appwrite";

import Spinner from "@/components/loaders/Spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFollowUser } from "@/hooks/tanstack-query/mutations/user-hooks";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { UnityHubError } from "@/lib/utils";
import { useReadAllFromIDB } from "@/hooks/use-indexedDB";
import { IDBStores, User } from "@/types";
import { useEffect, useState } from "react";

type FollowUserButtonProps = {
  className: string;
  targetUserId: string;
};

const FollowUserButton = ({
  className,
  targetUserId,
}: FollowUserButtonProps) => {
  const { toast } = useToast();

  const {
    data: fetchedCurrentUser,
    isLoading: isLoadingUser,
    isPending,
  } = useGetCurrentUser();

  const cachedUser = useReadAllFromIDB<User>(IDBStores.CURRENT_USER);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (cachedUser) {
      setUser(cachedUser[0]);
    }
    if (fetchedCurrentUser) {
      setUser(fetchedCurrentUser);
    }
  }, [fetchedCurrentUser, cachedUser]);

  const { mutateAsync: followAction, isPending: isFollowActionOn } =
    useFollowUser(targetUserId);

  if ((isLoadingUser || isPending) && !user) return <Spinner />;

  const hadFollowedUser = user?.followings.includes(targetUserId);

  async function followUserHandler(
    action: "follow" | "unfollow",
    e: React.MouseEvent
  ) {
    e.preventDefault();
    try {
      await followAction(action);
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
        null,
        hadFollowedUser ? "unfollow" : "follow"
      )}
      type="button"
      size="sm"
      className={`${className} ${
        hadFollowedUser
          ? "bg-dark-4 hover:bg-dark-3 border border-dark-1 text-light-1"
          : "bg-primary-500 hover:bg-primary-600"
      }`}
      disabled={isFollowActionOn}
      aria-disabled={isFollowActionOn}
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
