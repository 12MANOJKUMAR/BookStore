import {createSlice} from '@reduxjs/toolkit';

const authslice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    role: "user",
    user: null
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    changeRole(state, action){
      const role = action.payload;
      state.role = role;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});
export const authActions = authslice.actions;
export default authslice.reducer;