
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    users: [],
    error: "",
    authorized: false
}

export const fetchUser = createAsyncThunk( 'user/fetchUser', async () => {
    const response = await axios.get("");
    return response.data;
})

const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        login : (state) => {
            state.authorized = true;
        },
        logout: (state) => {
            state.authorized = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchUser.fulfilled, (state, payload) => {
            state.loading = false;
            state.users = payload?.payload;
        }),
        builder.addCase(fetchUser.rejected, (state, payload) => {
            state.loading = false;
            state.error = payload?.error?.message || "Failed to fetch user list"
        })
    }
})

export default user.reducer;
export const { login, logout } = user.actions;