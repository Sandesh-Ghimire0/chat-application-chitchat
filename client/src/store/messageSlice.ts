import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../types/message";

const initialState: Message[] = [];

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessages: (_, action: PayloadAction<Message[]>) => {
            return action.payload;
        },
        clearMessages: () => {
            return initialState;
        },
    },
});

export const { addMessages, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
