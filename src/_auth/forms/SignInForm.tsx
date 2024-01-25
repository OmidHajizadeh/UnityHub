import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
import { signinValidationSchema } from "@/lib/validation";
import { useSignInAccount } from "@/hooks/tanstack-query/mutations/auth-hooks";
import { UnityHubError } from "@/lib/utils";

const SignInForm = () => {
  const { toast } = useToast();

  const { mutateAsync: signInAccount, isPending: isUserLoading } =
    useSignInAccount();

  const form = useForm<z.infer<typeof signinValidationSchema>>({
    resolver: zodResolver(signinValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signinValidationSchema>) {
    try {
      await signInAccount({
        email: values.email,
        password: values.password,
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
          title: "ورود با خطا مواجه شد",
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
          ورود به حساب کاربری
        </h2>
        <p className="text-light-3 mt-2 small-medium md:base-regular">
          لطفاً مشخصات حساب کاربری خود را وارد کنید.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ایمیل</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="font-ultraLight" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز عبور</FormLabel>
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
            disabled={isUserLoading}
            aria-disabled={isUserLoading}
          >
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Spinner />
                در حال ورود...
              </div>
            ) : (
              "ورود"
            )}
          </Button>
          <div className="flex flex-col items-center gap-2">
            <p className="text-small-regular text-light-2 text-center mt-2">
              اکانت ندارید ؟
              <Link className="text-primary-500 ms-1" to="/sign-up">
                ثبت نام
              </Link>
            </p>
            <Link
              to={
                form.getValues("email")
                  ? `/forget-password?email=${form.getValues("email")}`
                  : "/forget-password"
              }
            >
              <small>رمز عبور خود را فراموش کردید ؟</small>
            </Link>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
