const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getAllUsers, getUserDetails, updateProfile } = require("../controllers/user.controller");
const { getOrCreateChat, getChatHistory, getAllChatId } = require("../controllers/message.controller");
const router = express.Router();


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.get("/get-user-details",authMiddleware,getUserDetails)
router.get("/get-all-users",authMiddleware,getAllUsers)
router.put("/update-profile",authMiddleware,updateProfile)

router.post("/chat",authMiddleware,getOrCreateChat)
router.get("/get-chat-history",authMiddleware,getChatHistory)

router.get("/get-all-chatId",authMiddleware,getAllChatId)

module.exports  = router