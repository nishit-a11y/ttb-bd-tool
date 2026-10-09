import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  editActivity: null,
  objectiveData: "",
  objectivePoints: ["", "", ""], // slide bullets -> game_obj_1..3 (**phrase** = bold)
  outcomes: ["", "", ""], // "Teams walk away with" -> game_outcome_1..3
  welcomeSlide: {
    tagline: "", welcome: "", model_name: "", model_type: "wheel", model_reference: "",
    elements: [{ label: "", line: "" }, { label: "", line: "" }, { label: "", line: "" }, { label: "", line: "" }],
    icon: "", // slide icon URL (game_icon)
    icon_concept: "", // what the icon shows (used by "Generate icon")
    scene: "", // illustration idea used by "Generate illustration"
    image: "", // welcome illustration: existing URL or new dataURL (uploaded on save)
  },
  descriptionData: { title: [], description: [] },
  game_name: "",
  game_url: "",
  material_cost: 0,
  game_type: "Inperson",
  specialActivity: false,
  imagesLogo: [],
  imagesActivity: [],
  imagesSpecial: [],
  imageCover: [],
  firebaseURLLogo: [],
  firebaseURLActivity: [],
  firebaseURLSpecial: [],
  category: "",
  program_fee: [0, 0, 0, 0, 0],
};

// Create the user slice using createSlice
export const CreateActivitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setObjectiveData: (state, action) => {
      state.objectiveData = action.payload;
    },
    setObjectivePoints: (state, action) => {
      state.objectivePoints = action.payload;
    },
    setOutcomes: (state, action) => {
      state.outcomes = action.payload;
    },
    setWelcomeSlide: (state, action) => {
      state.welcomeSlide = { ...state.welcomeSlide, ...action.payload };
    },
    setDescriptionData: (state, action) => {
      state.descriptionData = action.payload;
    },
    setGameName: (state, action) => {
      state.game_name = action.payload;
    },
    setGameURL: (state, action) => {
      state.game_url = action.payload;
    },
    setMaterialCost: (state, action) => {
      state.material_cost = action.payload;
    },
    setgame_type: (state, action) => {
      state.game_type = action.payload;
    },
    setImagesLogo: (state, action) => {
      state.imagesLogo = action.payload;
    },
    setImagesActivity: (state, action) => {
      state.imagesActivity = action.payload;
    },
    setImagesSpecial: (state, action) => {
      state.imagesSpecial = action.payload;
    },
    setImageCover: (state, action) => {
      state.imageCover = action.payload;
    },
    setFirebaseURLLogo: (state, action) => {
      state.firebaseURLLogo = action.payload;
    },
    setFirebaseURLActivity: (state, action) => {
      state.firebaseURLActivity = action.payload;
    },
    setFirebaseURLSpecial: (state, action) => {
      state.firebaseURLSpecial = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setProgramFee: (state, action) => {
      state.program_fee = action.payload;
    },
    setSpecialActivity: (state, action) => {
      state.specialActivity = action.payload;
    },
    setEditActivity: (state, action) => {
      state.editActivity = action.payload;
    },
    reset: () => initialState,
  },
});

// Export the actions and reducer
export const {
  setDescriptionData,
  setObjectiveData,
  setObjectivePoints,
  setOutcomes,
  setWelcomeSlide,
  setGameName,
  setGameURL,
  setActivity,
  setLoading,
  setFirebaseURLLogo,
  setFirebaseURLActivity,
  setFirebaseURLSpecial,
  setImagesActivity,
  setImagesLogo,
  setImagesSpecial,
  setImageCover,
  setgame_type,
  setCategory,
  setProgramFee,
  setSpecialActivity,
  setMaterialCost,
  setError,
  setEditActivity,
  reset,
} = CreateActivitySlice.actions;
export default CreateActivitySlice.reducer;
