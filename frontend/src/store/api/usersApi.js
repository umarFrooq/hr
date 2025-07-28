import { apiTags, roles } from "@/utils/constant";
import { baseApi } from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: [apiTags.USERS],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: apiTags.USERS, id }],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "users",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [apiTags.USERS],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `users/${id}`,
        method: "PATCH",
        data: userData,
      }),
      invalidatesTags: (result, error, { id }) => [apiTags.USERS, { type: apiTags.USERS, id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [apiTags.USERS],
    }),
    // Upload user document
    uploadUserDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `users/${id}/documents`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    // Delete user document
    deleteUserDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `users/${id}/documents`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadUserDocumentMutation,
  useDeleteUserDocumentMutation,
} = usersApi;

// Export the reducer to be included in the store
export default usersApi.reducer;
