import { createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    inputField: "",
    allFields: false,
  },
  reducers: {
    setInput: (state, action) => {
      state.inputField = action.payload;
    },
    setAllFieldsTrue: (state) => {
      state.allFields = true;
    },
    setAllFieldsFalse: (state) => {
      state.allFields = false;
    },
  },
});

export const { setInput, setAllFieldsTrue,setAllFieldsFalse } = inputSlice.actions;

export default inputSlice.reducer;
