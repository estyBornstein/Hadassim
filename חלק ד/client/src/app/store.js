import { configureStore } from "@reduxjs/toolkit"
import UserSlice from "../features/UserSlice";


const store = configureStore({
    reducer: {
        user:UserSlice
    }
})

export default store;