import { apiTags } from "@/utils/constant";
import { baseApi } from "./baseApi";

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: (params) => ({ url: "/leaves", method: "GET", params }),
      providesTags: [apiTags.LEAVES],
    }),
    addLeave: builder.mutation({
      query: (body) => ({
        url: "/leaves",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.LEAVES],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leaves/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: apiTags.LEAVES, id }],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `/leaves/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: apiTags.LEAVES, id }],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useAddLeaveMutation,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveMutation,
} = leaveApi;
