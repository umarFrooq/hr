import { getErrorMessage, getResponseData } from "@/utils/helpers";
import http from "@/utils/http";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }, { getState }) => {
    try {
      // Example: Access token from state
      const state = getState();
      const token = state.auth?.tokens?.access?.token;

      const result = await http({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const responseData = getResponseData(result);

      return {
        data: responseData,
      };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: { message: getErrorMessage(axiosError) },
          message: getErrorMessage(axiosError),
        },
      };
    }
  };
