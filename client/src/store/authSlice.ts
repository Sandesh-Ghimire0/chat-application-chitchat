// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { User } from "../types/client";

// const initialState: User = {
//     id: "",
//     username: "",
//     image: "",
//     token: "",
// };

// const userSlice = createSlice({
//     name: "user",
//     initialState,
//     reducers: {
//         login: (_, action: PayloadAction<User>) => {
//             console.log(action.payload)
//             return action.payload;
//         },

//         logout: () => {
//             return initialState;
//         },
//     },
// });

// export const { login } = userSlice.actions;
// export default userSlice.reducer;
