import { AppwriteException } from "appwrite";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/loaders/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useFollowUser } from "@/hooks/react-query/mutations";
import { useGetCurrentUser } from "@/hooks/react-query/queries";
import { UnityHubError } from "@/lib/utils";

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
    data: user,
    isLoading: isLoadingUser,
    isPending,
  } = useGetCurrentUser();
  const { mutateAsync: followAction, isPending: isFollowActionOn } =
    useFollowUser(targetUserId);

  if (!user || isLoadingUser || isPending) return <Spinner />;

  const hadFollowedUser = user.followings.includes(targetUserId);

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
