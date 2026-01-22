import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    user: null,
    isLoggingOut: false,
    lastLogoutTime: null,
    authChecked: false, // ✅ ensures initial auth check completed
  },
  reducers: {
    // Login user and set role/user
    login(state, action) {
      state.isLoggedIn = true;
      state.isLoggingOut = false;
      state.lastLogoutTime = null;
      state.user = action.payload?.user || null;
      state.role = action.payload?.role || "user";
      state.authChecked = true; // ✅ mark auth check done
    },

    // Logout user safely
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.role = "user";
      state.isLoggingOut = false;
      state.lastLogoutTime = Date.now();
      state.authChecked = true; // ✅ mark auth check done
    },

    // Temporarily set logging out flag (to block API calls)
    setLoggingOut(state, action) {
      state.isLoggingOut = action.payload;
    },

    // Change role dynamically
    changeRole(state, action) {
      state.role = action.payload;
    },

    // Set user data directly
    setUser(state, action) {
      state.user = action.payload;
    },

    // Update user safely (merge with existing data)
    updateUser(state, action) {
      state.user = { ...(state.user || {}), ...action.payload };
    },

    // Mark that initial auth check is complete
    setAuthChecked(state, action) {
      state.authChecked = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
