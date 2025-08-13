
const express = require("express");
const route = require("./routes/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const database = require("./config/database");
const cloud = require("./config/cloudinary")
const fileUpload = require("express-fileupload")


// Server and Socket
const http = require("http");
const { Server } = require("socket.io");
const { sendMessage, seenMessages } = require("./controllers/message.controller");
const { markAsOffline, markAsOnline } = require("./controllers/user.controller");

// Gemini AI
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { seenStatus, getAllStatusForSocket } = require("./controllers/status.controller");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const server = http.createServer(app);

// Connect to DB
database.db();
cloud.connectCloudinary();

// Middlewares
app.use(cookieParser());
app.use(cors({
    origin: ["https://whats-app-web-nu.vercel.app"], // Your frontend
    credentials: true,
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.json());
app.use(route);

// Sample route
app.get("/", (req, res) => {
    res.send(`<h1>Hello from WhatsApp Web</h1>`);
});

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin:[ "https://whats-app-web-nu.vercel.app"],
        credentials: true,
    },
});

// Socket.io logic
io.on("connection", (socket) => {
    socket.on("join", async (userId) => {
        socket.userId = userId;
        await markAsOnline(userId);
        socket.join(userId);
        socket.broadcast.emit("userOnline", { userId });
    });

    socket.on("sendMessage", async (data) => {
        try {
            // Save message to DB
            if(data.receiver !== "AI_BOT"){
                await sendMessage(data);
            }

            // Emit to receiver
            io.to(data.receiver).emit("receiveMessage", {
                chatId: data.chatId,
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                type: data.type,
                timestamp: new Date(),
            });

            // ✅ Auto-reply with Gemini AI if target is "AI Bot"
            if (data.receiver === "AI_BOT") {
                try {
                    const result = await model.generateContent(data.message);
                    const aiReply = result.response.text();

                    // Send AI's message as if it's from "AI_BOT"
                    const aiMessage = {
                        chatId: data.chatId,
                        sender: "AI_BOT",
                        receiver: data.sender,
                        message: aiReply,
                        type: "text",
                        timestamp: new Date(),
                    };

                    // Emit AI reply back to the user
                    io.to(data.sender).emit("receiveMessage", aiMessage);
                } catch (err) {
                    console.error("Gemini AI error:", err);
                }
            }

        } catch (error) {
            console.log("Error sending message:", error);
        }
    });

    socket.on("seenMessages", async (data) => {
        try {
            const updatedMessage = await seenMessages(data);
            io.to(data.sender).emit("messagesSeen", {
                updatedMessage,
                chatId: data.chatId,
                seenBy: data.sender,
                timestamp: Date.now(),
            });
            io.to(data.receiver).emit("messagesSeen", {
                updatedMessage,
                chatId: data.chatId,
                seenBy: data.sender,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error("Error marking messages as seen", error);
        }
    });

    socket.on("seenStatus",async(data)=>{
        const updatedStatus = await seenStatus(data)
        io.to(data.statusOwner).emit("statusSeen",{
            updatedStatus
        })
        io.to(data.seenBy).emit("statusSeen",{
            updatedStatus
        })
    })

    socket.on("addStatus",async(data)=>{
        const allStatus = await getAllStatusForSocket()
        
        io.emit("statusAdded",{
            allStatus
        })
    })

    

    socket.on("disconnect", async () => {
        await markAsOffline(socket?.userId);
        // console.log("❌ A user disconnected:", socket.userId);
        if (socket.userId) {
            socket.broadcast.emit("userOffline", { userId: socket.userId });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


