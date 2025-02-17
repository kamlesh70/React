import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: any = {
  isLoggedIn: false,
  user: null,
  isPending: true,
  error: null,
  extraDetails: null,
}

export const loginUser: any = createAsyncThunk('auth/login', async () => {
  return await new Promise((resolve: any, reject) => {
    setTimeout(() => {
      const user = { name: "kamlesh mehra" };
      resolve(user);
    }, 1000)
  })
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getLoggedInUser: (state): any => {
      return state.user;
    },
    isLoggedIn: (state): any => state.isLoggedIn,
    logout: (state): any => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    setExtraDetails: (state): any => {state.extraDetails = { test: "extra details" }},
    removeExtraDetails: (state): any => {state.extraDetails = null},
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isPending = true;
      state.error = null;
    }),
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isPending = false;
    }),
    builder.addCase(loginUser.rejected, (state, action) => { 
      state.isPending = false;
      state.error = action.payload;
    })
  }
})


export const { getLoggedInUser, isLoggedIn, logout, setExtraDetails, removeExtraDetails } =
  authSlice.actions;
export default authSlice.reducer;