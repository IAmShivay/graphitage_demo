import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ProductItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: ProductItem[];
  categories: string[];
  total: number;
  activeSort: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data: ProductItem;
}

export interface AdminProductsResponse {
  success: boolean;
  data: ProductItem[];
  metrics: {
    totalProducts: number;
    totalInventoryValue: number;
    lowStockCount: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface MeResponse {
  success: boolean;
  user: UserProfile | null;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product", "AdminProduct", "User"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      { search?: string; category?: string; sort?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search?.trim()) queryParams.set("search", params.search.trim());
        if (params.category && params.category !== "All") queryParams.set("category", params.category);
        if (params.sort) queryParams.set("sort", params.sort);
        return `/products?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Product" as const, id: _id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<ProductDetailResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getAdminProducts: builder.query<AdminProductsResponse, { search?: string }>({
      query: ({ search }) => {
        const queryParams = new URLSearchParams();
        if (search?.trim()) queryParams.set("search", search.trim());
        return `/admin/products?${queryParams.toString()}`;
      },
      providesTags: ["AdminProduct"],
    }),

    createProduct: builder.mutation<
      { success: boolean; message: string; data: ProductItem },
      Partial<ProductItem>
    >({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product", "AdminProduct"],
    }),

    updateProduct: builder.mutation<
      { success: boolean; message: string; data: ProductItem },
      { id: string } & Partial<ProductItem>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
        "AdminProduct",
      ],
    }),

    deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "AdminProduct"],
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Product", "AdminProduct"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(
              api.util.updateQueryData("getMe", undefined, (draft) => {
                draft.user = data.user;
                draft.success = true;
              })
            );
          }
        } catch {}
      },
    }),

    register: builder.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(
              api.util.updateQueryData("getMe", undefined, (draft) => {
                draft.user = data.user;
                draft.success = true;
              })
            );
          }
        } catch {}
      },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "AdminProduct"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getMe", undefined, (draft) => {
            draft.user = null;
            draft.success = true;
          })
        );
        try {
          await queryFulfilled;
          dispatch(api.util.resetApiState());
        } catch {
          patchResult.undo();
        }
      },
    }),

    seedDb: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/seed",
        method: "POST",
      }),
      invalidatesTags: ["Product", "AdminProduct", "User"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useSeedDbMutation,
} = api;
