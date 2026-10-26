"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { registerValidationSchema } from "@/lib/validations/yupAuth";
import { useRegisterMutation } from "@/store/api";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [register] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        await register(values).unwrap();
        router.push("/");
        router.refresh();
      } catch (err: any) {
        setServerError(err?.data?.error || "Registration failed");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-sm mx-auto my-16 px-4">
      <div className="border border-zinc-200 rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-lg font-bold text-zinc-900 mb-1">Customer Registration</h1>
        <p className="text-xs text-zinc-500 mb-5">
          Create an account to browse and save items
        </p>

        {serverError && (
          <div className="mb-4 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-3.5 text-xs" noValidate>
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Rahul Sharma"
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-[11px] text-red-600 mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="rahul@example.com"
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
              placeholder="At least 6 characters"
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
            {formik.isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-900 font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
