const BASE_URL = "http://localhost:4000"


export const authEndpoints = {
    SIGN_UP : BASE_URL + "/signup",
    LOGIN : BASE_URL + "/login",
    LOGOUT : BASE_URL + "/logout",
}


export const userEndpoints = {
    GET_USER_DETAILS : BASE_URL + "/get-user-details",
    GET_ALL_USERS : BASE_URL + "/get-all-users",
    UPDATE_PROFILE : BASE_URL + "/update-profile"
}


export const chatEndpoints = {
    GET_OR_CREATE_CHAT_ID : BASE_URL+"/chat",
    GET_CHAT_HISTORY : BASE_URL + "/get-chat-history",
    GET_ALL_CHAT_ID : BASE_URL + "/get-all-chatId"
}