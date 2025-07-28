import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { apiTags } from "@/utils/constant";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),

  tagTypes: Object.values(apiTags),
  endpoints: () => ({}),
});
