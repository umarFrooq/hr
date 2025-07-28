import { apiTags } from "@/utils/constant";
import { baseApi } from "./baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: (params) => ({ url: "/checkin", method: "get", params }),
      providesTags: [apiTags.ATTENDANCE],
    }),
    addAttendance: builder.mutation({
      query: (body) => ({
        url: "/checkin",
        method: "post",
        data: body,
      }),
      invalidatesTags: [apiTags.ATTENDANCE],
    }),
    updateAttendance: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/checkin/${id}`,
        method: "put",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: apiTags.ATTENDANCE, id }],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/checkin/${id}`,
        method: "delete",
      }),
      invalidatesTags: (result, error, id) => [{ type: apiTags.ATTENDANCE, id }],
    }),
    getAttendanceById: builder.query({
      query: (id) => ({
        url: `/checkin/${id}`,
        method: "get",
      }),
      providesTags: (result, error, id) => [{ type: apiTags.ATTENDANCE, id }],
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetAttendanceByIdQuery,
} = attendanceApi;
