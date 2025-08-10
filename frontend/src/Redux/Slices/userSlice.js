import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,

    userDetails : null,

    allUsers:null,

    chatHistory: {},              // { chatId: [messages] }

    pendingMessages: {},

    currentOpenChatId: null,
        
    unread: {},                     // { chatId: count }

    allChatId:null,

    allArrangedChatId : null,

    localLoading : false,

}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

        setLoading:(state,action)=>{
            state.loading = action.payload
        },

        setUserDetails:(state,action)=>{
            state.userDetails = action.payload;
        },

        clearUserDetails:(state)=>{
            state.userDetails = null
        },

        setAllUsers:(state,action)=>{
            state.allUsers = action.payload;
        },
        
        clearAllUsers:(state)=>{
            state.allUsers = null
        },

        setChatHistory: (state, action) => {
            const { chatId, messages } = action.payload;
            
            const pending = state.pendingMessages[chatId] || [];
            // state.chatHistory[chatId] = [...messages, ...pending];
            state.chatHistory[chatId] = [...messages];
            
            delete state.pendingMessages[chatId];

        },

        addMessage: (state, action) => {
            const { chatId, message } = action.payload;

            if (state.chatHistory[chatId]) {
                state.chatHistory[chatId].push(message);
            } else {
                if (!state.pendingMessages[chatId]) {
                    state.pendingMessages[chatId] = [];
                }
                state.pendingMessages[chatId].push(message);
            }

            if (chatId !== state.currentOpenChatId) {
                const currentData = state.unread[chatId] || { count: 0,message:null, lastUpdated: null };
                state.unread[chatId] = {
                    count: currentData.count + 1,
                    message:message,
                    lastUpdated: Date.now()
                };
            }

        },

        setCurrentOpenChat: (state, action) => {
            state.currentOpenChatId = action.payload;
            // Reset unread when opening chat
            delete state.unread[action.payload];
        },

        setAllChatId :(state,action)=>{
            state.allChatId = action.payload
        },

        clearAllChatId:(state,action)=>{
            state.allChatId = null
        },

        setAllArrangedChatId :(state,action)=>{
            state.allArrangedChatId = action.payload
        },

        clearAllArrangedChatId:(state,action)=>{
            state.allArrangedChatId = null
        },

        setLocalLoading :(state,action)=>{
            state.localLoading = action.payload
        },

        setUserOffline: (state, action) => {
            const {userId} = action.payload;
            if(!userId) return;
            if(!state.allUsers) return ;
            const userIndex = state?.allUsers?.findIndex(
                (user) => user?._id === userId
            );
            if (userIndex !== -1) {
                state.allUsers[userIndex].isOnline = false;
                state.allUsers[userIndex].lastSeen = Date.now();
            }
        },

        setUserOnline: (state, action) => {
            const {userId} = action.payload;
            if(!userId) return;
            if(!state.allUsers) return ;
            const userIndex = state?.allUsers?.findIndex(
                (user) => user?._id === userId
            );
            if (userIndex !== -1) {
                state.allUsers[userIndex].isOnline = true;
                state.allUsers[userIndex].lastSeen = Date.now();
            }
        }



    }
})

export const {setLoading, setUserDetails, clearUserDetails,setAllUsers,clearAllUsers,addMessage,setChatHistory,setCurrentOpenChat,setAllArrangedChatId,clearAllArrangedChatId,setAllChatId,clearAllChatId,setLocalLoading,setUserOffline,setUserOnline} = userSlice.actions
export default userSlice.reducer