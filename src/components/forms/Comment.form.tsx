import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppwriteException } from "appwrite";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/loaders/Spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateComment,
  useUpdateComment,
} from "@/hooks/tanstack-query/mutations/comment-hooks";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { UnityHubError } from "@/lib/utils";
import { CommentValidationSchema } from "@/lib/validation";
import { Post, Comment } from "@/types";

type CommentFormProps = {
  comment?: Comment;
  action: "create" | "update";
  post: Post;
  closeModal: () => void;
};

const CommentForm = ({
  comment,
  action,
  post,
  closeModal,
}: CommentFormProps) => {
  const { toast } = useToast();
  const { data: user } = useGetCurrentUser();

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
    if (!user) return;
    try {
      if (comment && action === "update") {
        await updateComment({
          commentId: comment.$id,
          text: values.text,
          author: user.$id,
          postId: post.$id,
          edited: true,
        });
      } else {
        await createComment({
          comment: {
            text: values.text,
            author: user,
            postId: post.$id,
          },
          post: post,
        });
      }
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
    } finally {
      closeModal();
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
          aria-disabled={isCreating || isUpdating}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  dir="auto"
                  className="shad-textarea font-light !bg-dark-1 custom-scrollbar"
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
            aria-disabled={isCreating || isUpdating}
            type="submit"
            className="shad-button_primary bg-primary-500 whitespace-nowrap"
          >
            {isCreating || isUpdating ? (
              <div className="flex-center gap-2">
                <Spinner />
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

export default CommentForm;
