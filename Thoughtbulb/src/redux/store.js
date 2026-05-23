import { configureStore } from "@reduxjs/toolkit";
import CreateActivityReducer from "../pages/CreateActivity/CreateActivitySlice";
import ActivityReducer from "../pages/Activities/ActivitySlice";
import UserReducer from "../pages/UserSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    activity: ActivityReducer,
    createActivity: CreateActivityReducer,
    users: UserReducer,
  },
});

export default store;
