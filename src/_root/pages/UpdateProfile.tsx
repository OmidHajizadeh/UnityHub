import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AppwriteException } from "appwrite";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { ProfileValidation } from "@/lib/validation";
import Spinner from "@/components/loaders/Spinner";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useGetCurrentUser } from "@/hooks/react-query/queries";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: user } = useGetCurrentUser();

  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name,
      bio: user?.bio,
      username: user?.username,
      email: user?.email,
    },
  });

  if (!user)
    return (
      <div className="flex-center w-full h-full">
        <Spinner size={50} />
      </div>
    );

  async function updateUserHandler(value: z.infer<typeof ProfileValidation>) {
    try {
      if (!user) return;

      await updateUser({
        $id: user.$id,
        name: value.name,
        file: value.file,
        bio: value.bio,
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      });

      navigate(`/profile/${user.$id}`);
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
          title: "خطا در ویرایش اطلاعات",
          description: "لطفا دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="flex flex-1">
      <Helmet>
        <title>ویرایش پروفایل</title>
      </Helmet>
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">ویرایش پروفایل</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateUserHandler)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={user.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">اسم</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">بیوگرافی</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="auto"
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">نام کاربری</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">ایمیل</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}
              >
                کنسل
              </Button>
              <Button
                type="submit"
                className="shad-button_primary bg-primary-500 whitespace-nowrap"
                disabled={isUpdatingUser}
              >
                {isUpdatingUser && <Spinner />}
                ویرایش پروفایل
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
