import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  sendResetPasswordLink,
  createUserAccount,
  resetPassword,
  signInAccount,
  signOutAccount,
} from "@/api/user.api";
import { NewUser, ResetPassword } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export function useCreateUserAccount() {
  return useMutation({
    mutationFn: (user: NewUser) => createUserAccount(user),
  });
}

export function useSignInAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user.email, user.password),
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    },
  });
}

export function useSignOutAccount() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signOutAccount,
    onSuccess: () => navigate("/sign-in"),
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (email: string) => sendResetPasswordLink(email),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (passwordObj: ResetPassword) => resetPassword(passwordObj),
    onSuccess: () => {
      toast({
        title: "رمز عبور شما با موفقیت تغییر یافت",
      });
      navigate("/sign-in");
    },
  });
}
