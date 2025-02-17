import { configureStore } from "@reduxjs/toolkit";

import userListReducer from './slices/userSlice';
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    userList: userListReducer,
    auth: authReducer,
  },
});

export default store;