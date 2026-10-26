import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please provide a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Please provide a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .required("Password is required"),
});

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;
export type RegisterFormValues = Yup.InferType<typeof registerValidationSchema>;
