const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getAllUsers, getUserDetails, updateProfile, updateProfilePicture } = require("../controllers/user.controller");
const { getOrCreateChat, getChatHistory, getAllChatId, getAllMessages } = require("../controllers/message.controller");
const { addStatus, getAllStatus } = require("../controllers/status.controller");
const router = express.Router();


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.get("/get-user-details",authMiddleware,getUserDetails)
router.get("/get-all-users",authMiddleware,getAllUsers)
router.put("/update-profile",authMiddleware,updateProfile)
router.put("/update-profile-picture",authMiddleware,updateProfilePicture)

router.post("/chat",authMiddleware,getOrCreateChat)
router.get("/get-chat-history",authMiddleware,getChatHistory)
router.get("/get-all-messages",authMiddleware,getAllMessages)

router.get("/get-all-chatId",authMiddleware,getAllChatId)

router.post("/add-status",authMiddleware,addStatus)
router.get("/get-all-status",authMiddleware,getAllStatus)

module.exports  = router