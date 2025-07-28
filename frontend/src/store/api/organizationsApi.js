import { apiTags, roles } from "@/utils/constant";
import { baseApi } from "./baseApi";

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrganizations: builder.query({
      query: (params) => ({
        url: "/organizations",
        method: "GET",
        params,
      }),
      providesTags: [apiTags.ORGANIZATIONS],
    }),
    createOrganization: builder.mutation({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.ORGANIZATIONS],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/organizations/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        apiTags.ORGANIZATIONS,
        { type: apiTags.ORGANIZATIONS, id },
      ],
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [apiTags.ORGANIZATIONS],
    }),
    uploadOrganizationLogo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/organizations/${id}`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        apiTags.ORGANIZATIONS,
        { type: apiTags.ORGANIZATIONS, id },
      ],
    }),
    getOrganizationById: builder.query({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: apiTags.ORGANIZATIONS, id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useUploadOrganizationLogoMutation,
  useGetOrganizationByIdQuery,
} = organizationsApi;

// Export the reducer to be included in the store
export default organizationsApi.reducer;
