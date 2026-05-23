import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  users: null,
};

// Create the user slice using createSlice
export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersReducer: (state, action) => {
      state.users = action.payload;
    },
    reset: () => initialState,
  },
});

// Export the actions and reducer
export const { setUsersReducer, reset } = UserSlice.actions;
export default UserSlice.reducer;
