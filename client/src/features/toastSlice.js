import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    message: "",
    type: "", // success | error | info
    visible: false,
  },
  reducers: {
    showToast: (state, action) => {
      const { message, type = "info" } = action.payload;
      state.message = message;
      state.type = type;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
