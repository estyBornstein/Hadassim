import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice
    (
        {
            name: "user",
            initialState: { currentUser: JSON.parse(localStorage.getItem("currentUser")) || null },
            reducers: {
                signIn: (state, action) => {
                    state.currentUser = action.payload;
                    localStorage.setItem("currentUser", JSON.stringify(action.payload));
                },
                signOut: (state, action) => {
                    state.currentUser = null;
                    localStorage.removeItem("currentUser");
                }
            }
        })
export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;