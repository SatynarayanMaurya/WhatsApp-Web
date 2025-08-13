const BASE_URL = "https://whatsapp-web-r6dr.onrender.com"

export const authEndpoints = {
    SIGN_UP : BASE_URL + "/signup",
    LOGIN : BASE_URL + "/login",
    LOGOUT : BASE_URL + "/logout",
}

export const userEndpoints = {
    GET_USER_DETAILS : BASE_URL + "/get-user-details",
    GET_ALL_USERS : BASE_URL + "/get-all-users",
    UPDATE_PROFILE : BASE_URL + "/update-profile",
    UPDATE_PROFILE_PICTURE : BASE_URL + "/update-profile-picture"
}


export const chatEndpoints = {
    GET_OR_CREATE_CHAT_ID : BASE_URL+"/chat",
    GET_CHAT_HISTORY : BASE_URL + "/get-chat-history",
    GET_ALL_CHAT_ID : BASE_URL + "/get-all-chatId",
    GET_ALL_MESSAGES : BASE_URL + "/get-all-messages"
}


export const statusEndpoints = {
    ADD_STATUS : BASE_URL+"/add-status",
    GET_ALL_STATUS : BASE_URL + "/get-all-status"
}
