import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice"
import eventReducer from "../features/eventSlice"
import toastReducer from "../features/toastSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
        toast: toastReducer,
    }
})

export default store;