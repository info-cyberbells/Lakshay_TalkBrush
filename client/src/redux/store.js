import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice"
import eventReducer from "../features/eventSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
    }
})

export default store;