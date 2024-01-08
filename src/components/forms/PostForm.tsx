import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppwriteException, Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { useToast } from "../ui/use-toast";
import Loader from "../loaders/Spinner";
import { useUserContext } from "@/context/AuthContext";
import { postValidationSchema } from "@/lib/validation";
import { useCreatePost, useUpdatePost } from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";
import TagsInput from "../shared/TagsInput";

const PostForm = ({
  post,
  action,
}: {
  post?: Models.Document;
  action: "create" | "update";
}) => {
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof postValidationSchema>>({
    resolver: zodResolver(postValidationSchema),
    defaultValues: {
      caption: post?.caption || "",
      files: [],
      location: post?.location || "",
      tags: post?.tags || [],
    },
  });

  const { setValue } = form;

  async function onSubmit(values: z.infer<typeof postValidationSchema>) {
    try {
      if (post && action === "update") {
        console.log(values.tags);

        await updatePost({
          ...values,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
        });

        return navigate(-1);
      }

      await createPost({
        ...values,
        userId: user.id,
      });

      return navigate(-1);
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
          title: "ویرایش پست با خطا مواجه شد",
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
        <div className="lg:grid flex flex-col grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">کپشن</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="auto"
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">لوکیشن</FormLabel>
                  <FormControl>
                    <Input
                      dir="auto"
                      type="text"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                      هشتگ ها
                  </FormLabel>
                  <FormControl>
                    <TagsInput field={field} setFormValue={setValue} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">افزودن عکس</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-center justify-end">
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
              "آپلود"
            ) : (
              "ویرایش"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
