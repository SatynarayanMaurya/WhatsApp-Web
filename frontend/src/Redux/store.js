import { configureStore } from '@reduxjs/toolkit'
import  userSlice from './Slices/userSlice'
import statusSlice from "./Slices/statusSlice"

export const store = configureStore({
  reducer: {
    user:userSlice,
    status:statusSlice,
  },
})