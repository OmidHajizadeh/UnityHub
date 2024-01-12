import * as z from "zod";

export const signupValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "اسم نمیتواند کمتر از 2 کارکتر باشد" })
    .max(50, { message: "اسم نمیتواند بیشتر از 50 کارکتر باشد" }),
  username: z
    .string()
    .trim()
    .regex(
      new RegExp(/^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/),
      "نام کاربری وارد شده معتبر نمی باشد"
    )
    .min(3, { message: "نام کاربری نمیتواند کمتر از 3 کارکتر باشد" })
    .max(30, { message: "نام کاربری نمیتواند بیشتر از 30 کارکتر باشد" }),
  email: z
    .string()
    .email({ message: "ایمیل وارد شده معتبر نمی باشد" })
    .min(8, { message: "ایمیل نمیتواند کمتر از 8 کارکتر باشد" }),
  password: z
    .string()
    .min(8, { message: "پسورد نمیتواند کمتر از 8 کارکتر باشد" })
    .max(50, { message: "پسورد نمیتواند بیشتر از 50 کارکتر باشد" }),
});

export const signinValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "ایمیل وارد شده معتبر نمی باشد" })
    .min(8, { message: "ایمیل نمیتواند کمتر از 8 کارکتر باشد" }),
  password: z
    .string()
    .min(8, { message: "پسورد نمیتواند کمتر از 8 کارکتر باشد" }),
});

export const postValidationSchema = z.object({
  caption: z
    .string()
    .min(5, {
      message: "کپشن نمیتواند کمتر از 5 کارکتر باشد",
    })
    .max(2200, {
      message: "کپشن نمیتواند بیشتر از 2200 کارکتر باشد",
    }),
  files: z.custom<File[]>(),
  location: z
    .string()
    .min(1, {
      message: "لوکیشن نمیتواند کمتر از 1 کارکتر باشد",
    })
    .max(100, {
      message: "لوکیشن نمیتواند بیشتر از 100 کارکتر باشد",
    }),
  tags: z.custom<string[]>(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "اسم نمیتواند کمتر از 2 کارکتر باشد" }),
  bio: z.string(),
  username: z
    .string()
    .min(2, { message: "نام کاربری نمیتواند کمتر از 2 کارکتر باشد" }),
  email: z
    .string()
    .email({ message: "ایمیل وارد شده معتبر نمی باشد" })
    .min(8, { message: "ایمیل نمیتواند کمتر از 8 کارکتر باشد" }),
});

export const CommentValidationSchema = z.object({
  text: z
    .string()
    .trim()
    .min(2, { message: "متن کامنت نمیتواند کمتر از 2 کارکتر باشد" }),
});
