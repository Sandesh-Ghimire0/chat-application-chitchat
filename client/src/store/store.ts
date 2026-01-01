import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import friendReducer from "./friendSlice";
import messageReducer from "./messageSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        friend: friendReducer,
        message: messageReducer,
    },
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
