import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AppwriteException } from "appwrite";

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
import { forgetPasswordValidationSchema } from "@/lib/validation";
import { useForgetPassword } from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";
import { useState } from "react";

const ForgetPasswordForm = () => {
  const { toast } = useToast();
  // const navigate = useNavigate();
  const {
    mutateAsync: forgetPasswordHandler,
    isPending: isRequestPending,
    isSuccess,
  } = useForgetPassword();

  const form = useForm<z.infer<typeof forgetPasswordValidationSchema>>({
    resolver: zodResolver(forgetPasswordValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof forgetPasswordValidationSchema>
  ) {
    try {
      await forgetPasswordHandler(values.email);
      // form.reset();
      // navigate("/");
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
          title: "ارسال لینک ریست رمز عبور با خط مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col px-4 sm:px-0">
        <img src="/images/icon.svg" alt="logo" className="max-w-[5rem]" />
        <h2 className="h3-bold mt-3 md:h2-bold font-bold pt-5 sm-pt-12">
          فراموشی رمز عبور
        </h2>
        <p className="text-light-3 mt-2 small-medium md:base-regular">
          {isSuccess
            ? "لینک ریست کردن رمز عبور به ایمیل شما فرستاده شد."
            : "لطفاً ایمیل خود را در فیلد زیر وارد کنید."}
        </p>
        {!isSuccess && (
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

            <Button
              type="submit"
              className="shad-button_primary bg-primary-500 mt-3"
              disabled={isRequestPending}
            >
              {isRequestPending ? (
                <div className="flex-center gap-2">
                  <Spinner />
                  در حال ارسال...
                </div>
              ) : (
                "ارسال درخواست"
              )}
            </Button>
          </form>
        )}
      </div>
    </Form>
  );
};

export default ForgetPasswordForm;