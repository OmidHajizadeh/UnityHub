import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AppwriteException } from "appwrite";

import Logo from "/images/icon.svg";
import { signupValidationSchema } from "@/lib/validation";

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
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/hooks/tanstack-query/mutations/auth-hooks";
import { UnityHubError } from "@/lib/utils";

const SignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isUserLoading } =
    useSignInAccount();

  const form = useForm<z.infer<typeof signupValidationSchema>>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupValidationSchema>) {
    try {
      await createUserAccount(values);

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        navigate("/sign-in");
      }

      navigate("/");
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
          title: "ثبت نام با خطا مواجه شد",
          description: "لطفا مجدداً امتحان کنید.",
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
          ایجاد حساب کاربری جدید
        </h2>
        <p className="text-light-3 mt-2 small-medium md:base-regular">
          برای ایجاد حساب کاربری جدید، جزئیات اکانت خود را وارد کنید.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="font-ultraLight" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام کاربری</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="font-ultraLight" />
              </FormItem>
            )}
          />
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
                <FormLabel>پسوورد</FormLabel>
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
            disabled={isUserLoading || isCreatingUser}
            aria-disabled={isUserLoading || isCreatingUser}
          >
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Spinner />
                در حال ثبت نام...
              </div>
            ) : isUserLoading ? (
              <div className="flex-center gap-2">
                <Spinner />
                در حال ورود...
              </div>
            ) : (
              "ثبت نام"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            اکانت دارید ؟
            <Link className="text-primary-500 ms-1" to="/sign-in">
              ورود
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
