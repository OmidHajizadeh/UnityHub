import { AppwriteException } from "appwrite";

import DeleteIcon from "/icons/delete.svg";
import Alert from "@/components/shared/Alert";
import { useToast } from "@/components/ui/use-toast";
import { UnityHubError } from "@/lib/utils";
import { Comment } from "@/types";
import { useDeleteComment } from "@/hooks/tanstack-query/mutations/comment-hooks";

const DeleteCommentForm = ({
  comment,
  postCreatorId,
}: {
  comment: Comment;
  postCreatorId: string;
}) => {
  const { toast } = useToast();

  const { mutateAsync: deleteComment, isPending } = useDeleteComment(
    comment.postId
  );

  async function deleteCommentHandler() {
    try {
      await deleteComment({ comment, postCreatorId });
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
          title: "حذف کامنت با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Alert
      title="آیا مطمئن هستید ؟"
      description="این عملیات برگشت ناپذیر است و تمام اطلاعات مربوط به این کامنت بطور کامل حذف خواهند شد."
      isLoading={isPending}
      onConfirm={deleteCommentHandler}
    >
      <img
        src={DeleteIcon}
        alt="delete"
        width={18}
        height={18}
        className="cursor-pointer"
      />
    </Alert>
  );
};

export default DeleteCommentForm;
