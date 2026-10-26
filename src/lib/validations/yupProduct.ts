import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title cannot exceed 120 characters")
    .required("Product title is required"),
  category: Yup.string()
    .trim()
    .required("Category is required"),
  price: Yup.number()
    .typeError("Please enter a valid numeric price")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Please enter a valid whole number for stock")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock quantity is required"),
  imageUrl: Yup.string()
    .trim()
    .url("Image URL must be a valid URL")
    .required("Image URL is required"),
  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .required("Description is required"),
});

export const productQueryValidationSchema = Yup.object().shape({
  search: Yup.string().max(100).default(""),
  category: Yup.string().max(50).default(""),
  sort: Yup.string()
    .oneOf(["newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc"])
    .default("newest"),
});

export type ProductFormValues = Yup.InferType<typeof productValidationSchema>;
export type ProductQueryValues = Yup.InferType<typeof productQueryValidationSchema>;
