import {createSlice} from '@reduxjs/toolkit';

const authslice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    role: "user"
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    changeRole(state, action){
      const role = action.payload;
      state.role = role;
    },
  },
});
export const authActions = authslice.actions;
export default authslice.reducer;