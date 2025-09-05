 import {configureStore} from "@reduxjs/toolkit"  ;
 import authReducer from "./auth" ;
 const store = configureStore({
  reducer: {
    // reducer is used to manage the state of the application (inital and final state)
    auth: authReducer,
  },
})

export default store;