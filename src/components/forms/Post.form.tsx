import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppwriteException } from "appwrite";
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
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/loaders/Spinner";
import TagsInput from "@/components/shared/TagsInput";
import { postValidationSchema } from "@/lib/validation";
import { UnityHubError, mediaType } from "@/lib/utils";
import {
  useCreatePost,
  useUpdatePost,
} from "@/hooks/tanstack-query/mutations/post-hooks";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { Post } from "@/types";

type PostFormProp = {
  action: "update" | "create";
  post?: Post;
};

const PostForm = ({ post, action }: PostFormProp) => {
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const { data: user } = useGetCurrentUser();

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

  const { setValue, setError, clearErrors } = form;

  const fileErrorHandling = {
    set: (message: string) => {
      setError("files", {
        message,
      });
    },
    clear: () => clearErrors("files"),
  };

  async function onSubmit(values: z.infer<typeof postValidationSchema>) {
    if (!user) return;

    try {
      if (post && action === "update") {
        await updatePost({
          ...values,
          $id: post.$id,
        });
        navigate(-1);
      } else {
        await createPost({
          ...values,
          userId: user.$id,
          mediaType: mediaType(values.files[0]),
        });
        navigate("/");
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
          title:
            action === "update"
              ? "ویرایش پست با خطا مواجه شد"
              : "آپلود پست با خطا مواجه شد",
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
                  <FormControl className="relative">
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
                      placeholder="تهران"
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
                    هشتگ ها (بعد از وارد کردن متن هشتگ، اینتر بزنید)
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
                <FormLabel className="shad-form_label">افزودن مدیا</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl || ""}
                    mediaType={post?.mediaType}
                    videoErrorHandling={fileErrorHandling}
                    updateMode={action === "update"}
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
            aria-disabled={isCreating || isUpdating}
            type="submit"
            className="shad-button_primary w-full md:w-auto bg-primary-500 whitespace-nowrap"
          >
            {isCreating || isUpdating ? (
              <div className="flex-center gap-2">
                <Spinner />
                {action === "create" ? "آپلود" : "ویرایش"}
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
