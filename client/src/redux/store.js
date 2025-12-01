import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice"
import eventReducer from "../features/eventSlice"
import toastReducer from "../features/toastSlice"
import dashboardReducer from "../features/dashboardSlice";
import activitiesReducer from '../features/activitiesSlice';
import analyticsReducer from '../features/AnalyticsSlice';
import roomReducer from "../features/roomSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
        toast: toastReducer,
        dashboard: dashboardReducer,
        activities: activitiesReducer,
        analytics: analyticsReducer,
        room: roomReducer,
    }
})

export default store;