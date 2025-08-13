import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    statusLoading:false,
    allStatus : null,

}

export const stateSlice = createSlice({
    name:"status",
    initialState,
    reducers:{

        setAllStatus:(state,action)=>{
            state.allStatus = action.payload
        },
        clearAllStatus:(state,action)=>{
            state.allStatus = null
        },

        setStatusLoading:(state,action)=>{
            state.statusLoading = action.payload
        }


    }
})

export const {setAllStatus,clearAllStatus,setStatusLoading} = stateSlice.actions
export default stateSlice.reducer