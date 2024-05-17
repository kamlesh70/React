import { configureStore } from "@reduxjs/toolkit";

import userListReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        userList: userListReducer
    }
})

export default store;