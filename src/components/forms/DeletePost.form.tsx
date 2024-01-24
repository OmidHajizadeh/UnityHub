import { AppwriteException } from "appwrite";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "/icons/delete.svg";
import Alert from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Post } from "@/types";
import { UnityHubError } from "@/lib/utils";
import { useDeletePost } from "@/hooks/tanstack-query/mutations/post-hooks";

const DeletePostForm = ({ post }: { post: Post }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutateAsync: deletePost, isPending } = useDeletePost();

  async function deletePostHandler(postId: string, imageId: string) {
    try {
      await deletePost({
        postId,
        imageId,
      });

      navigate(-1);
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
          title: "حذف پست با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Alert
      title="آیا مطمئن هستید ؟"
      description="این عملیات برگشت ناپذیر است و تمام اطلاعات مربوط به این پست بطور کامل حذف خواهند شد."
      isLoading={isPending}
      onConfirm={deletePostHandler.bind(null, post.$id, post.imageId)}
    >
      <Button variant="ghost" className="ghost_details-delete-btn">
        <img src={DeleteIcon} alt="delete" width={24} height={24} />
      </Button>
    </Alert>
  );
};

export default DeletePostForm;
