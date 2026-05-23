import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  searchField: "",
  gameType: "All",
  openFilter: false,
  status: "All",
};

// Create the user slice using createSlice
export const ActivitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setSearchField: (state, action) => {
      state.searchField = action.payload;
    },
    setGameType: (state, action) => {
      state.gameType = action.payload;
    },
    setOpenFilter: (state, action) => {
      state.openFilter = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    reset: () => initialState,
  },
});

// Export the actions and reducer
export const { setSearchField, setOpenFilter, setGameType, setStatus, reset } =
  ActivitySlice.actions;
export default ActivitySlice.reducer;
