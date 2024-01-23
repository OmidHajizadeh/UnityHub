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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/loaders/Spinner";
import { CommentValidationSchema } from "@/lib/validation";
import {
  useCreateComment,
  useUpdateComment,
} from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";
import { useGetCurrentUser } from "@/hooks/react-query/queries";

type CommentFormProps = {
  comment?: Models.Document;
  action: "create" | "update";
  post: Models.Document;
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
            author: user.$id,
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