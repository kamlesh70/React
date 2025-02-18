import { configureStore } from "@reduxjs/toolkit";

import userListReducer from './slices/userSlice';
import authReducer from "./slices/authSlice";
import { userAPI } from "./api/userApiSlice";

const store = configureStore({
  reducer: {
    userList: userListReducer,
    auth: authReducer,
    [userAPI.reducerPath]: userAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware),
});

export default store;