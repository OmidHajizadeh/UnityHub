import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppwriteException } from "appwrite";

import Logo from "/images/icon.svg";
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
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/loaders/Spinner";
import { resetPasswordValidationSchema } from "@/lib/validation";
import { useResetPassword } from "@/hooks/tanstack-query/mutations/auth-hooks";
import { UnityHubError } from "@/lib/utils";

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const { mutateAsync: resetPasswordHandler, isPending: isRequestPending } =
    useResetPassword();

  const form = useForm<z.infer<typeof resetPasswordValidationSchema>>({
    resolver: zodResolver(resetPasswordValidationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof resetPasswordValidationSchema>
  ) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userId = urlSearchParams.get("userId");
    const secret = urlSearchParams.get("secret");

    if (!userId || !secret) return;
    try {
      await resetPasswordHandler({
        userId,
        secret,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
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
          title: "تغییر رمز عبور با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col px-4 sm:px-0">
        <img src={Logo} alt="UnityHub" className="max-w-[5rem]" />
        <h2 className="h3-bold mt-3 md:h2-bold font-bold pt-5 sm-pt-12">
          ساخت رمز عبور جدید
        </h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز عبور جدید</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="font-ultraLight" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تکرار رمز عبور جدید</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="font-ultraLight" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="shad-button_primary bg-primary-500 mt-3"
            disabled={isRequestPending}
            aria-disabled={isRequestPending}
          >
            {isRequestPending ? (
              <div className="flex-center gap-2">
                <Spinner />
                در حال ارسال...
              </div>
            ) : (
              "ارسال"
            )}
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
