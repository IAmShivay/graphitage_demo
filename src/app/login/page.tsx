"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { loginValidationSchema } from "@/lib/validations/yupAuth";
import { useLoginMutation } from "@/store/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const [serverError, setServerError] = useState<string | null>(null);
  const [login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const response = await login(values).unwrap();

        if (response.user.role === "admin" && redirectUrl === "/") {
          router.push("/admin/products");
        } else {
          router.push(redirectUrl);
        }
        router.refresh();
      } catch (err: any) {
        setServerError(err?.data?.error || "Login failed");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-sm mx-auto my-16 px-4">
      <div className="border border-zinc-200 rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-lg font-bold text-zinc-900 mb-1">Sign In</h1>
        <p className="text-xs text-zinc-500 mb-5">
          Enter your email and password to access your account
        </p>

        {serverError && (
          <div className="mb-4 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-3.5 text-xs" noValidate>
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com"
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] text-red-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-medium transition-colors disabled:opacity-50 mt-1"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Do not have an account?{" "}
          <Link href="/register" className="text-zinc-900 font-medium hover:underline">
            Register as Customer
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 space-y-1">
          <p className="font-semibold text-zinc-700">Demo Credentials:</p>
          <p>Admin: admin@ecommerce.com / Admin@123</p>
          <p>Customer: customer@ecommerce.com / Customer@123</p>
        </div>
      </div>
    </div>
  );
}
