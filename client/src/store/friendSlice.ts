import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Friend } from "../types/client";

const initialState: Friend[] = [];

const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        addFriends: (_, action: PayloadAction<Friend[]>) => {
            return action.payload;
        },
    },
});

export const { addFriends } = friendSlice.actions;
export default friendSlice.reducer;
