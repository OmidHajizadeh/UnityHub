import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Models } from "appwrite";
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
import Loader from "../shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { postValidationSchema } from "@/lib/validation";
import {
  useCreatePost,
  useUpdatePost,
} from "@/hooks/react-query/queriesAndMutaions";

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
      tags: post?.tags.join(",") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof postValidationSchema>) {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });
      if (!updatedPost) {
        return toast({
          variant: "destructive",
          title: "ویرایش پست با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
        });
      }
      return navigate("/posts/" + post.$id);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      return toast({
        variant: "destructive",
        title: "آپلود پست با خطا مواجه شد",
        description: "لطفاً دوباره امتحان کنید.",
      });
    }
    navigate("/");
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
                    تگ (با کاما از هم جدا کنید)
                  </FormLabel>
                  <FormControl>
                    <Input
                      dir="auto"
                      type="text"
                      className="shad-input"
                      placeholder="Art, Expression, Learn"
                      {...field}
                    />
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
          <Button type="button" className="shad-button_dark_4">
            کنسل
          </Button>
          <Button
            disabled={isCreating || isUpdating}
            type="submit"
            className="shad-button_primary whitespace-nowrap"
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
