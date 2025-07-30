import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../utils/http";
import { toast } from "sonner";
import { getErrorMessage, getResponseData } from "@/utils/helpers";
import { getPermissionsMap } from "@/utils/permission";

const initialState = {
  user: null,
  permissions: null,
  tokens: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await http.post("/auth/login", loginData);
    const responseData = getResponseData(response);
    return responseData;
  } catch (err) {
    const message = getErrorMessage(err);
    toast.error(message);
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    addUserOrganization: (state, { payload }) => {
      state.user.organizationData = payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = { ...action.payload?.user, salary: 100000 };
        state.tokens = action.payload?.tokens;
        state.permissions = getPermissionsMap(
          action?.payload?.user?.rolePermission?.permissions ?? []
        );
        state.error = null;
        localStorage.setItem("token", action.payload?.tokens?.access?.token);
        localStorage.setItem("isSynced", "true");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, updateUser, addUserOrganization } = authSlice.actions;
export default authSlice.reducer;
