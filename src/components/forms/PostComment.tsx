import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppwriteException, Models } from "appwrite";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import Loader from "../loaders/Spinner";
import { useUserContext } from "@/context/AuthContext";
import { CommentValidationSchema } from "@/lib/validation";
import {
  useCreateComment,
  useUpdateComment,
} from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";

type PostCommentProps = {
  comment?: Models.Document;
  action: "create" | "update";
  post: Models.Document;
  closeModal: () => void;
};

const PostComment = ({
  comment,
  action,
  post,
  closeModal,
}: PostCommentProps) => {
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof CommentValidationSchema>>({
    resolver: zodResolver(CommentValidationSchema),
    defaultValues: {
      text: comment?.text || "",
    },
  });

  const { mutateAsync: createComment, isPending: isCreating } =
    useCreateComment();
  const { mutateAsync: updateComment, isPending: isUpdating } =
    useUpdateComment();

  async function onSubmit(values: z.infer<typeof CommentValidationSchema>) {
    try {
      if (comment && action === "update") {
        await updateComment({
          commentId: comment.$id,
          text: values.text,
          author: user.id,
          postId: post.$id,
        });
      } else {
        await createComment({
          comment: {
            text: values.text,
            author: user.id,
            postId: post.$id,
          },
          post: post,
        });
      }
      closeModal();
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
          title: "بارگذاری کامنت با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="text"
          disabled={isCreating || isUpdating}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  dir="auto"
                  className="shad-textarea !bg-dark-1 custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex -mt-4 items-center justify-end">
          <Button
            disabled={isCreating || isUpdating}
            type="submit"
            className="shad-button_primary bg-primary-500 whitespace-nowrap"
          >
            {isCreating || isUpdating ? (
              <div className="flex-center gap-2">
                <Loader />
                در حال ارسال...
              </div>
            ) : action === "create" ? (
              "ارسال"
            ) : (
              "ویرایش"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostComment;
