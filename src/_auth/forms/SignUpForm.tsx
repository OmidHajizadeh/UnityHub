import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutaions";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
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
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "ثبت نام با خطا مواجه شد",
        description: "لطفا مجدداً امتحان کنید.",
        variant: 'destructive'
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "ورود با خطا مواجه شد",
        description: "لطفا مجدداً امتحان کنید.",
        variant: 'destructive'
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "ثبت نام با خطا مواجه شد",
        description: "لطفا مجدداً امتحان کنید.",
        variant: 'destructive'
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col px-4 sm:px-0">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold font-bold font-iranyekan pt-5 sm-pt-12">
          ایجاد حساب کاربری جدید
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary mt-3">
            {isCreatingUser || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                در حال ارسال...
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
